import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from "@angular/common/http";
import {Http} from "@angular/http";
import {Router} from "@angular/router";
import {DataSetService} from "../services/dataset.service";

declare var $: any;

@Component({
  selector: 'app-sopra-description',
  templateUrl: 'sopraDescription.component.html'
})

export class SopraDescriptionComponent implements OnInit {
  result:any = [];
  validerDescriptionForm: FormGroup;
  description = new FormControl('', Validators.required);
  constructor(public httpClient: HttpClient,
              public http: Http,
              private router: Router,
              private formBuilder: FormBuilder,
              private datasetService: DataSetService
              ) {
  }

  ngOnInit() {
    this.validerDescriptionForm = this.formBuilder.group({
      description: this.description
    });
    }
  validation(){
    console.log(this.validerDescriptionForm.value)
    this.datasetService.validerDescription(this.validerDescriptionForm.value).subscribe(
      res => {
        this.result = JSON.parse(res._body)
        console.log(this.result)
    console.log(res)
      },
      error => {
        console.log(error);
        console.log('erreuuur');

      }
    );

  }



}

