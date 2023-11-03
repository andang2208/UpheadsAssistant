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
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { OpenAIService } from 'src/app/api-clients/open-api.client';
import { QUESTION_TYPE } from '../models/question-model.component';

@UntilDestroy()
@Component({
    selector: 'app-builder',
    templateUrl: './builder.component.html',
    styleUrls: ['./builder.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BuilderComponent implements OnInit, AfterViewInit {
    form: FormGroup = new FormGroup({
        tableName: new FormControl('', Validators.required),
        columns: new FormArray([]),
    });
    integrationTestForm: FormGroup = new FormGroup({
        command: new FormControl('', Validators.required),
    });
    type_enum = QUESTION_TYPE;
    resultTableIndex$: Observable<any>;
    resultItegrationTest$: Observable<any>;
    constructor(
        private fb: FormBuilder,
        private openAI: OpenAIService,
        private spinner: NgxSpinnerService
    ) {}

    ngOnInit() {
        this.formInit();
        this.resultTableIndex$ = this.resultTableIndex();
        this.resultItegrationTest$ = this.resultInteTest();
    }

    public apiKey: string =
        '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';

    formInit() {
        this.form = this.fb.group({
            tableName: new FormControl('', Validators.required),
            columns: this.fb.array([this.createColumnNameFormGroup()]),
            answer: new FormControl(''),
        });
        this.integrationTestForm = this.fb.group({
            functionName: new FormControl('', Validators.required),
            answer: new FormControl(''),
        });
    }

    ngAfterViewInit() {}

    get columns() {
        return this.form.controls['columns'] as FormArray;
    }

    public addColumn() {
        if (this.columns.length === 5) return;
        this.columns.push(this.createColumnNameFormGroup());
    }

    private createColumnNameFormGroup(): FormGroup {
        return new FormGroup({
            columnName: new FormControl('', Validators.required),
        });
    }

    public askIntegrationTest() {
        const functionName = this.integrationTestForm.get('functionName').value;
        const question =
            'I have {0}, give me 5 best cases that I can follow and write the integration test, just give me title shortly please'.replace(
                '{0}',
                functionName
            );
        this.InteSub$.next(question);
    }

    tableIndexSub$ = new BehaviorSubject<string>(null);
    resultTableIndex(): Observable<any> {
        return this.tableIndexSub$.pipe(
            untilDestroyed(this),
            switchMap((question) => {
                if (!this.form.valid) {
                    return of('');
                }
                return this.handleMessage(question);
            })
        );
    }

    InteSub$ = new BehaviorSubject<string>(null);
    resultInteTest(): Observable<any> {
        return this.InteSub$.pipe(
            untilDestroyed(this),
            switchMap((question) => {
                if (!this.integrationTestForm.valid) {
                    return of('');
                }
                return this.handleMessage(question);
            })
        );
    }

    handleMessage(question: string) {
        const messages: any[] = [
            {
                // TODO Change this to your own prompt
                content: question,
                role: 'user',
            },
        ];
        this.spinner.show();
        return this.openAI
            .doOpenAICall(messages, 0.5, 'gpt-3.5-turbo', this.apiKey)
            .pipe(
                switchMap((res) => {
                    this.spinner.hide();
                    return of(res);
                }),
                tap((res) => {})
            );
    }
    public ask() {
        let indexQuestion =
            'I have table {0} with columns {1}, could you suggest me that I should to create index on which column,  describe shortly in every single column please?';

        indexQuestion = indexQuestion.replace(
            '{0}',
            this.form.get('tableName').value
        );

        const rawData = this.form.getRawValue();
        const columnNames = rawData.columns.map((m: any, index: number) => {
            return m.columnName;
        });

        indexQuestion = indexQuestion.replace('{1}', columnNames.join(', '));
        this.tableIndexSub$.next(indexQuestion);
    }

    public genSQL(i: number) {
        const columnName = this.columns.at(i).value.columnName;
        const tableName = this.form.get('tableName').value;
        const indexName = 'IX_' + tableName + '_' + columnName;
        let askForSQL =
            "create Sql query to check if indexName is not existed then create index indexName for column {1} on the table {2}, and just show me the query please don't explain anything";

        askForSQL = askForSQL.replace(/indexName/gi, indexName);
        askForSQL = askForSQL.replace('{1}', columnName);
        askForSQL = askForSQL.replace('{2}', tableName);
        this.tableIndexSub$.next(askForSQL);
    }
}
