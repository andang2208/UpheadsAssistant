import { Routes } from '@angular/router';

const Routing: Routes = [
    // {
    //     path: '',
    //     redirectTo: '/producer/overview',
    //     pathMatch: 'full',
    // },
    // {
    //     path: 'producer',
    //     loadChildren: () =>
    //         import('../modules/producers/producers.module').then(
    //             (m) => m.ProducerModule
    //         ),
    // },

    // { path: 'overview', component: ProducerOverviewComponent, },

    // {
    //     path: '',
    //     redirectTo: '/home',
    //     pathMatch: 'full',
    // },
    {
        path: '',
        redirectTo: 'form',
    },
    {
        path: 'form',
        loadChildren: () =>
            import('../modules/form/form-page.module').then(
                (m) => m.MainPageModule
            ),
    },
    {
        path: '**',
        redirectTo: 'error/404',
    },
];

export { Routing };
