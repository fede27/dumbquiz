import * as Promise from 'bluebird';
import * as Express from 'express';

import { BaseAPI } from './baseAPI';
import { QuestionsController } from '../controllers/questionsController';


export class HomeAPI extends BaseAPI {

    private questions = new QuestionsController();

    public constructor() {
        super();
        this.router.get('/', this.index.bind(this));
    }

    public index(request: Express.Request, response: Express.Response, next: Express.NextFunction) {
        this.logRequest(request);

        return this.questions.getActive().then((activeQuestion) => {
            const questionMessage: string = (activeQuestion) ? activeQuestion.question : 'Non ci sono domande in questo momento';
            response.render('home', { 
                title: 'Dumb Quiz homepage',
                question: questionMessage,
            });
        });
    }
}