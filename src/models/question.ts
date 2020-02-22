import * as Moongose from 'mongoose';


export type QuestionDocument = Moongose.Document & {
    title: string;
    question: string;
    active: boolean;
}


const questionSchema = new Moongose.Schema({
    title: String,
    question: String,
    active: Boolean,
}, { timestamps: true });


export const Question = Moongose.model<QuestionDocument>("questions", questionSchema);