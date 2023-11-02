import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    {
        path: 'error',
        loadChildren: () =>
            import('./modules/errors/errors.module').then(
                (m) => m.ErrorsModule
            ),
    },
    {
        path: '',
        loadChildren: () =>
            import('./_metronic/layout/layout.module').then(
                (m) => m.LayoutModule
            ),
    },
    { path: '**', redirectTo: 'error/404' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
