import * as Promise from 'bluebird';

import {BaseController} from './baseController';
import { QuestionModel, IQuestion } from '../models/question';



export class QuestionsController extends BaseController {

    private model = new QuestionModel();
    
    public getById(id: string): Promise<IQuestion> {
        return Promise.try(() => {
            return this.model.getById(id);
        });
    }

    public getAll(): Promise<IQuestion[]> {
        return Promise.try(() => {
            return this.model.getAll();
        });
    }

    public getActive(): Promise<IQuestion> {
        return Promise.try(() => {
            return this.model.getActive();
        });
    }
}