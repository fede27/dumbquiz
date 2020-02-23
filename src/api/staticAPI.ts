import * as Promise from 'bluebird';
import * as Express from 'express';

import { BaseAPI } from './baseAPI';


export class StaticAPI extends BaseAPI {

    public constructor() {
        super();
        this.router.get('/', this.index.bind(this));
    }

    public index(request: Express.Request, response: Express.Response, next: Express.NextFunction) {
        response.render('home', { title: 'Dumb Quiz homepage' });
    }
}