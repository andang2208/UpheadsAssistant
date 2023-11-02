import {
    AfterViewInit,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { filter, tap } from 'rxjs/operators';
import { FormApiClient } from 'src/app/api-clients/form-api.client';
import { AddQuestionsModalComponent } from '../modals/add-questions-modal.component';
import {
    CheckboxAnswer,
    CheckboxType,
    ParagraphType,
    QUESTION_TYPE,
    Question,
    QuestionType,
} from '../models/question-model.component';

@UntilDestroy()
@Component({
    selector: 'app-builder',
    templateUrl: './builder.component.html',
    styleUrls: ['./builder.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BuilderComponent implements OnInit, AfterViewInit {
    form: FormGroup = new FormGroup({
        questions: new FormArray([]),
    });
    type_enum = QUESTION_TYPE;
    constructor(
        private modalService: NgbModal,
        private fb: FormBuilder,
        private router: Router,
        private formApiClient: FormApiClient,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.formInit();
    }

    ngAfterViewInit() {}

    formInit() {
        this.form = new FormGroup({
            questions: new FormArray([]),
        });
        this.formApiClient.get().subscribe((items) => {
            if (items) {
                items.forEach((item: Question) => {
                    this.addQuestionForm(item);
                });
            }
        });
    }

    get questions() {
        return this.form.controls['questions'] as FormArray;
    }

    addNewQuestionClicked() {
        // Open dialog
        const modalRef = this.modalService.open(AddQuestionsModalComponent, {
            size: 'lg',
            backdrop: 'static',
            windowClass: 'my-modal',
        });

        modalRef.closed
            .pipe(
                untilDestroyed(this),
                filter((isConfirm) => isConfirm),
                tap((result: Question) => {
                    this.addQuestionForm(result);
                })
            )
            .subscribe();
    }

    review() {
        // Validation
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            this.toastr.warning('Please finish form.');
            return;
        }
        const questions = this.questions.getRawValue();
        this.formApiClient.post(questions);
        this.router.navigate(['/answers']);
    }

    private addQuestionForm(item: Question) {
        // Add question data to form group
        let questionForm = new FormGroup({});

        questionForm = this.fb.group({
            type: item.type,
            required: item.required,
            question: item.question,
        });

        switch (item.type) {
            // type Paragraph with control paragraphAnswer: paragraphData.answer,
            case QuestionType.Paragraph:
                let paragraphData = item.data as ParagraphType;
                questionForm.addControl(
                    'paragraphAnswer',
                    new FormControl(
                        paragraphData.answer,
                        item.required ? Validators.required : null
                    )
                );
                break;
            // type Checkbox with control checkboxAnswers: FormArray
            case QuestionType.Checkbox:
                let checkboxData = item.data as CheckboxType;
                questionForm.addControl(
                    'checkboxAnswers',
                    new FormArray(
                        [],
                        item.required ? this.minSelectedCheckboxes(1) : null
                    )
                );
                questionForm.addControl(
                    'allowOtherAnswer',
                    new FormControl(checkboxData.allowOtherAnswer)
                );
                // add answers to checkboxAnswers form array
                this.addCheckBoxAnswerForm(questionForm, checkboxData.answers);
                break;
            default:
                break;
        }
        if (questionForm) this.questions.push(questionForm);
    }

    private minSelectedCheckboxes(min = 1) {
        const validator: ValidatorFn = (formArray: AbstractControl) => {
            if (formArray instanceof FormArray) {
                const totalSelected = formArray.controls
                    .map((control) => control.value.checked)
                    .reduce((prev, next) => (next ? prev + next : prev), 0);
                return totalSelected >= min ? null : { required: true };
            }
        };
        return validator;
    }

    private addCheckBoxAnswerForm(
        questionForm: FormGroup,
        items: Array<CheckboxAnswer>
    ) {
        //  Add checkbox answer to array form
        items.forEach((item) => {
            let answerForm = this.fb.group({
                checked: item.checked,
                id: item.id,
                text: item.text,
                isOther: item.isOther,
            });
            (questionForm.controls['checkboxAnswers'] as FormArray).push(
                answerForm
            );
        });
    }

    getValueInQuestionsForm(i: number, formName: string) {
        const control = this.questions?.at(i);
        return control?.get(formName)?.value;
    }

    getCheckBoxAnswerFormArray(i: number) {
        const control = this.questions?.at(i);
        return control?.get('checkboxAnswers') as FormArray;
    }

    getValueInCheckboxAnswerForm(i: number, k: number, formName: string) {
        const control = this.getCheckBoxAnswerFormArray(i)?.at(k);
        return control?.get(formName)?.value;
    }

    isShowOtherAnswer(i: number, k: number) {
        return (
            this.getValueInQuestionsForm(i, 'allowOtherAnswer') &&
            this.getValueInCheckboxAnswerForm(i, k, 'checked') &&
            this.getValueInCheckboxAnswerForm(i, k, 'isOther')
        );
    }
}
