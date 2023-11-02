export enum QuestionType {
    Paragraph,
    Checkbox,
}

export const QUESTION_TYPE = {
    Paragraph: QuestionType.Paragraph,
    CheckBox: QuestionType.Checkbox,
};

export class ParagraphType {
    answer: string;
    constructor(data: any) {
        this.answer = data.paragraphAnswer;
    }
}

export interface CheckboxAnswer {
    checked: boolean;
    text: string;
    id: number;
    isOther: boolean;
}

export class CheckboxType {
    allowOtherAnswer: boolean;
    answers: Array<CheckboxAnswer>;

    constructor(data: any) {
        this.allowOtherAnswer = data.allowOtherAnswer;
        this.answers = data.checkboxAnswers;
    }
}

export class Question {
    type: QuestionType;
    required: boolean;
    question: string;
    data: CheckboxType | ParagraphType;
}
