import {
    AfterViewInit,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import {
    CheckboxAnswer,
    QUESTION_TYPE,
    Question,
} from '../models/question-model.component';

@UntilDestroy()
@Component({
    selector: 'app-add-questions-modal',
    templateUrl: './add-questions-modal.component.html',
    styleUrls: ['./add-questions-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AddQuestionsModalComponent implements OnInit, AfterViewInit {
    form: FormGroup;
    types = [
        { id: 0, text: 'Paragraph' },
        { id: 1, text: 'Checkbox' },
    ];
    type_enum = QUESTION_TYPE;
    constructor(
        private fb: FormBuilder,
        private activeModal: NgbActiveModal,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.formInit();
    }

    get checkboxAnswers() {
        return this.form.controls['checkboxAnswers'] as FormArray;
    }

    ngAfterViewInit() {}

    formInit() {
        this.form = this.fb.group({
            type: 0,
            required: false,
            question: ['', Validators.required],
            allowOtherAnswer: false,
            checkboxAnswers: this.fb.array([
                this.createCheckboxAnswerFormGroup(),
            ]),
        });
    }

    private createCheckboxAnswerFormGroup(): FormGroup {
        return new FormGroup({
            answer: new FormControl('', Validators.required),
        });
    }

    public addCheckboxAnswerFormGroup() {
        if (this.checkboxAnswers.length === 5) return;
        this.checkboxAnswers.push(this.createCheckboxAnswerFormGroup());
    }

    close(): void {
        this.activeModal.close(null);
    }

    private validation() {
        // clear validators on checkboxAnswers when selected Paragraph type
        if (
            this.form.get('question').value &&
            this.form.get('type').value === this.type_enum.Paragraph
        ) {
            this.checkboxAnswers.controls.forEach((item) => {
                const answerCtrl = item.get('answer');
                answerCtrl.clearValidators();
                answerCtrl.updateValueAndValidity();
            });
        }

        // Validation
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            this.toastr.warning('Please finish form.');
            return false;
        }
        return true;
    }

    submit(): void {
        if (!this.validation()) return;
        // Submit data
        const rawData = this.form.getRawValue();
        const answers = rawData.checkboxAnswers.map((m: any, index: number) => {
            return {
                checked: false,
                id: index,
                text: m.answer,
            } as CheckboxAnswer;
        });
        if (rawData.allowOtherAnswer) {
            answers.push({
                checked: false,
                id: answers.length,
                text: 'Other',
                isOther: true,
            });
        }
        const question = {
            type: rawData.type,
            question: rawData.question,
            required: rawData.required,
            data: {
                allowOtherAnswer: rawData.allowOtherAnswer,
                answers: answers,
            },
        } as Question;
        this.activeModal.close(question);
    }
}
