import {
    AfterViewInit,
    Component,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FormApiClient } from 'src/app/api-clients/form-api.client';
import {
    CheckboxType,
    ParagraphType,
    QUESTION_TYPE,
    Question,
} from '../models/question-model.component';

@UntilDestroy()
@Component({
    selector: 'app-answers',
    templateUrl: './answers.component.html',
    styleUrls: ['./answers.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AnswersComponent implements OnInit, AfterViewInit {
    questions: Question[] = [];
    type = QUESTION_TYPE;
    constructor(private router: Router, private formApiClient: FormApiClient) {}

    ngOnInit() {
        this.formApiClient.get().subscribe((res) => {
            this.questions = res;
        });
    }

    ngAfterViewInit() {}

    back() {
        this.router.navigate(['/builder']);
    }

    getParagraphAnswer(item: Question) {
        const paragraph = item.data as ParagraphType;
        return paragraph.answer;
    }

    getCheckboxAnswers(item: Question) {
        const checkbox = item.data as CheckboxType;
        return checkbox.answers.filter((f) => f.checked).map((m) => m.text);
    }
}
