
import { BaseAPI } from './baseAPI';
import * as Quip from 'quip';
import * as Express from 'express';
import { APIResponse, EAPIResponseStatus } from './APIResponse';

import { QuestionsController } from '../controllers/questionsController';

export class QuizAPI extends BaseAPI {

    private questionController: QuestionsController = new QuestionsController();

    public constructor() {
        super();
        this.router.get('/questions', this.getActiveQuestions.bind(this));
        this.router.post('/questions', this.createQuestion.bind(this));
    }

    public getActiveQuestions(request: Express.Request, response: Express.Response, next: Express.NextFunction) {
        return this.questionController.getActive().then((activeQuestion) => {
            return this.sendResponse(response, APIResponse.createResponse(EAPIResponseStatus.success, 'ok').setData(activeQuestion));
        });
    }

    public createQuestion(request: Express.Request, response: Express.Response, next: Express.NextFunction) {
        return this.sendResponse(response, APIResponse.createResponse(EAPIResponseStatus.success, 'ok').setData({
            hello: 'world',
        }));
    }

}