import { Routes } from '@angular/router';


import {SopraDescriptionComponent} from "./sopraDescription.component";

export const SopraDescriptionRoutes: Routes = [
  {

    path: '',
    children: [ {
      path: 'sopradescription',
      component: SopraDescriptionComponent
    }]
  }
];
