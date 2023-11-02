import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuilderComponent } from './builder/builder.component';
import { AnswersComponent } from './answers/answers.component';

const routes: Routes = [
    { path: '', redirectTo: 'builder' },
    { path: 'builder', component: BuilderComponent },
    { path: 'answers', component: AnswersComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MainPageRoutingModule {}
