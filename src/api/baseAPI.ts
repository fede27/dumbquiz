import * as constants from '../globalConstants';
import { Response, Request, NextFunction, Router } from "express";
import * as Quip from 'quip';
import * as Winston from 'Winston';

import { APIResponse, EAPIResponseStatus } from './APIResponse';

export abstract class BaseAPI {

    protected _router: Router = Router();

    public isAdministrator(request: Request, response: Response, next: NextFunction): void {
        // if (request.user.administrator) {
        if (true) {
            next();
        } else {
            this.sendResponse(response, APIResponse.createResponse(EAPIResponseStatus.forbidden, 'Forbidden'));
        }
    }

    public isAuthenticated(request: Request, response: Response, next: NextFunction): void {
        if (request.isAuthenticated()) {
            next();
        } else {
            this.sendResponse(response, APIResponse.createResponse(EAPIResponseStatus.unauthorized, 'Unauthorized'));
        }
    }

    public get router(): Router {
        return this._router;
    }
    
    public logRequest(request: Request): void {
        Winston.info(`[${ constants.APP_NAME }] Request ${ request.url } from ${ request.ip }`);
    }

    public sendResponse(expressResponse: Response, apiResonse: APIResponse) {
        let response = Quip(expressResponse);

        switch (apiResonse.status) {
            case EAPIResponseStatus.error:
                response = response.error();
                break;
            case EAPIResponseStatus.forbidden:
                response = response.forbidden();
                break;
            case EAPIResponseStatus.success:
                response = response.ok();
                break;
            case EAPIResponseStatus.unauthorized:
                response = response.unauthorized();
                break;
        }

        response.json({
            status: apiResonse.status,
            message: apiResonse.message,
            timestamp: apiResonse.timestamp,
            data: apiResonse.data,
        });
    }
}