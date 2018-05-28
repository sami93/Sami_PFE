import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {CommonModule, DatePipe} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdModule } from '../md/md.module';
import { MaterialModule } from '../app.module';

import { descriptionRoutes } from './description.routing';
import {descriptionComponent} from './description.component';
import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {AddDialogComponent} from '../dialogs/add/add.dialog.component';
import {EditDialogComponent} from '../dialogs/edit/edit.dialog.component';
import {DeleteDialogComponent} from 'app/dialogs/delete/delete.dialog.component';
import {DataService} from '../services/data.service';
import {DataSetService} from '../services/dataset.service';
import {PredictionService} from '../services/prediction.service';
import {HttpModule} from '@angular/http';
import {ParticlesModule} from 'angular-particle';
import {TeximateModule} from 'ng-teximate';


@NgModule({
    declarations: [
      descriptionComponent,
        AddDialogComponent,
        EditDialogComponent,
        DeleteDialogComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(descriptionRoutes),
        FormsModule,
        MdModule,
        MaterialModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpModule,
        ParticlesModule,
        TeximateModule

    ],

    entryComponents: [
        AddDialogComponent,
        EditDialogComponent,
        DeleteDialogComponent
    ],
    providers: [
        DataService,
        DataSetService,
        PredictionService,
        DatePipe
    ]
})

export class descriptionModule {}
