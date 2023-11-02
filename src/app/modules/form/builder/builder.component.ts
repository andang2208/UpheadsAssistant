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
import { UntilDestroy } from '@ngneat/until-destroy';
import { OpenApiClient } from 'src/app/api-clients/open-api.client';
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
    constructor(private fb: FormBuilder, private openAI: OpenApiClient) {}

    ngOnInit() {
        this.formInit();
    }

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
            'I have {0}, give me 5 best cases that I can write for the integration test, shortly answer please'.replace(
                '{0}',
                functionName
            );
        this.openAI.sendMessage(question).subscribe((response: any) => {
            const reply = response.choices[0].message.content;
            this.integrationTestForm.get('answer').setValue(reply);
        });
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

        this.openAI.sendMessage(indexQuestion).subscribe((response: any) => {
            const reply = response.choices[0].message.content;
            this.form.get('answer').setValue(reply);
        });
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

        this.openAI.sendMessage(askForSQL).subscribe((response: any) => {
            const reply = response.choices[0].message.content;
            const value = this.form.get('answer').value;
            this.form
                .get('answer')
                .setValue(
                    value +
                        '\n\n---------------------------------------\n\n' +
                        reply
                );
        });
    }
}
