import * as Promise from 'bluebird';
import * as Express from 'express';

import { BaseAPI } from './baseAPI';
import { isAuthenticated } from '../auth/authStrategy';
import { QuestionsController } from '../controllers/questionsController';


export class AdminAPI extends BaseAPI {

    private questions = new QuestionsController();

    public constructor() {
        super();
        this.router.get('/', isAuthenticated, this.index.bind(this));
    }

    public index(request: Express.Request, response: Express.Response, next: Express.NextFunction) {
        this.logRequest(request);

        return this.questions.getActive().then((activeQuestion) => {
            const questionMessage: string = (activeQuestion) ? activeQuestion.question : 'Non ci sono domande in questo momento';
            response.render('admin', { 
                title: 'Amministrazione Dumb Quiz',
                question: questionMessage,
                reservationList: [],
                answer: null,
            });
        });
    }
}