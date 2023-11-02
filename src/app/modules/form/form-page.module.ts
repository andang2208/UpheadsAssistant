import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BuilderComponent } from './builder/builder.component';
import { MainPageRoutingModule } from './form-page-routing.module';
import { AnswersComponent } from './answers/answers.component';

@NgModule({
    declarations: [
        BuilderComponent,
        AnswersComponent
    ],
    imports: [
        CommonModule,
        MainPageRoutingModule,
        SharedModule,
    ],
    providers: [DatePipe],
})
export class MainPageModule {}
