import * as Promise from 'bluebird';
import * as Express from 'express';
import * as Passport from 'passport';
import { IVerifyOptions } from "passport-local";
import { check, sanitize, validationResult} from 'express-validator';

import { BaseAPI } from './baseAPI';


import { APIResponse, EAPIResponseStatus } from './APIResponse';
import { User, UserDocument } from '../models/user';

export class UserAPI extends BaseAPI {

    public constructor() {
        super();
        this.router.get('/login', this.showLogin.bind(this));
        this.router.post('/login', this.validateLoginParams.bind(this), Passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login'}));
        this.router.get('/logout', this.logout.bind(this));
        this.router.post('/logout', this.logout.bind(this));
    }

    public validateLoginParams(request: Express.Request, response: Express.Response, next: Express.NextFunction) {
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

            return next();
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

    public showLogin(request: Express.Request, response: Express.Response, next: Express.NextFunction) {
        this.logRequest(request);

        response.render('login', {});
    }
}