import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {CommonModule, DatePipe} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdModule } from '../md/md.module';
import { MaterialModule } from '../app.module';

import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';

import {DataService} from '../services/data.service';
import {DataSetService} from '../services/dataset.service';
import {PredictionService} from '../services/prediction.service';
import {HttpModule} from '@angular/http';
import {ParticlesModule} from 'angular-particle';
import {TeximateModule} from 'ng-teximate';
import {SopraDescriptionComponent} from "./sopraDescription.component";
import {SopraDescriptionRoutes} from "./sopraDescription.routing";


@NgModule({
  declarations: [
    SopraDescriptionComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(SopraDescriptionRoutes),
    FormsModule,
    MdModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    ParticlesModule,
    TeximateModule

  ],


  providers: [
    DataService,
    DataSetService,
    PredictionService,
    DatePipe
  ]
})

export class sopraDescriptionModule {}
