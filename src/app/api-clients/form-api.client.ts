import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    CheckboxType,
    ParagraphType,
    QUESTION_TYPE,
    Question,
    QuestionType,
} from '@modules/form/models/question-model.component';
import { Observable, of } from 'rxjs';
import { deserialize, serialize } from 'serializr';

@Injectable({
    providedIn: 'root',
})
export class FormApiClient {
    constructor(private httpClient: HttpClient) {}

    get(): Observable<Question[]> {
        const questionString = localStorage.getItem('question_data');
        let questions = [];
        if (questionString) {
            const rawData = JSON.parse(questionString);
            questions = rawData.map((m: any) => {
                let obj = {
                    type: m.type,
                    required: m.required,
                    question: m.question,
                    data:
                        m.type === QUESTION_TYPE.CheckBox
                            ? new CheckboxType(m)
                            : new ParagraphType(m),
                } as Question;
                return obj;
            });
        }
        return of(questions);
    }

    post(request: any): Observable<boolean> {
        localStorage.setItem('question_data', JSON.stringify(request));
        return of(true);
    }
}
