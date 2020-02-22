


export interface IQuestion {
    id: string;
    title: string;
    question: string;
    active: boolean; 
}


export class QuestionModel {


    private counter: number = 1;
    private questions: IQuestion[] = [{
        id: '1',
        title: 'test',
        question: 'Numero di teste di Cerbero',
        active: true,
    }]

    public getById(id: string): IQuestion {

        if (id === '1') {
            return this.questions[1];
        }

        return null;
    }

    public getActive(): IQuestion {
        for (let i = 0; i < this.questions.length; i++) {
            if (this.questions[i].active) {
                return this.questions[i];
            }
        }

        return null;
    }

    public getAll(from?: number, page?: number): IQuestion[] {
        return this.questions;
    }

    public publish(title: string, question: string): string {
        const q = {
            id: (++this.counter).toString(),
            title,
            question,
            active: true,
        };

        this.unpublishAll();
        this.questions.push(q);
    }

    private unpublishAll() {
        for (let i = 0; i < this.questions.length; i++) {
            this.questions[i].active = false;
        }
    }

}