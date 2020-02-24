import * as constants from '../globalConstants';
import * as Promise from 'bluebird';


import {BaseController} from './baseController';
import {Question, QuestionDocument } from '../models/question';


export class QuestionsController extends BaseController {
    
    public getById(id: string): Promise<QuestionDocument> {
        return new Promise((resolve, reject) => {
            return Question.findById(id, (error, question: QuestionDocument) => {
                if (error) {
                    return reject(error)
                }

                return resolve(question);
            });
        });
    }

    public getAll(from: number = 0, pageSize: number = constants.MAX_PAGE_SIZE): Promise<QuestionDocument[]> {

        pageSize = Math.min(Math.max(pageSize, 1), constants.MAX_PAGE_SIZE);

        return new Promise((resolve, reject) => {
            return Question
                    .find({})
                    .sort({ _id: 'desc' })
                    .skip(from)
                    .limit(pageSize)
                    .exec((error, questions: QuestionDocument[]) => {
                        if (error) {
                            return reject(error);
                        }

                        return resolve(questions);
                    });
        });
    }

    public getActive(): Promise<QuestionDocument> {

        return new Promise((resolve, reject) => {
            return Question.find({ active: true }, (error, questions: QuestionDocument[]) => {
                if (error) {
                    return reject(error);
                }

                if (questions.length) {
                    return resolve(questions[0]);
                }

                return resolve(null);
            });
        });
    }
}