import { Routes } from '@angular/router';

import { descriptionComponent } from './description.component';

export const descriptionRoutes: Routes = [
    {

        path: '',
        children: [ {
            path: 'description',
            component: descriptionComponent
        }]
    }
];
