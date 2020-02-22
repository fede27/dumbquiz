import * as Promise from 'bluebird';
import * as Express from 'express';
import * as Passport from 'passport';
import { IVerifyOptions } from "passport-local";
import { check, sanitize, validationResult} from 'express-validator';

import { BaseAPI } from './baseAPI';


import { APIResponse, EAPIResponseStatus } from './APIResponse';
import { UserDocument } from '../models/user';

export class UserAPI extends BaseAPI {

    public constructor() {
        super();
        this.router.post('/login', this.login.bind(this));
        this.router.post('/logout', this.logout.bind(this));
    }

    public login(request: Express.Request, response: Express.Response, next: Express.NextFunction) {
        this.logRequest(request);

        return Promise.try(() => {
            return check("email", "Email is not valid").isEmail().run(request)
                    .then(() => check("password", "Password cannot be blank").isLength({min: 1}).run(request))
                    .then(() => sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(request));
        }).then(() => {
            const errors = validationResult(request);

            if (!errors.isEmpty()) {
                throw Error(errors[0]);
            }

            return Passport.authenticate('local', (error: Error, user: UserDocument, info: IVerifyOptions) => {
                if (error) {
                   throw error;
                }

                if (!user) {
                    throw Error(info.message);
                }
            });
        }).catch((error) => {
            const message = (error.message) ? error.message : error
            return this.sendResponse(response, APIResponse.createResponse(EAPIResponseStatus.error, message));
        });
    }

    public logout(request: Express.Request, response: Express.Response, next: Express.NextFunction) {
        this.logRequest(request);

        request.logout();
        response.redirect('/');
    }
}