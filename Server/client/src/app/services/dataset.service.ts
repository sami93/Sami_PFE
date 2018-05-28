import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class DataSetService {
    private url = 'http://localhost:3000';
    private headers = new Headers({'Content-Type': 'application/json', 'charset': 'UTF-8'});
    private options = new RequestOptions({headers: this.headers});

    constructor(private http: Http) {
    }

    getDataSets(): Observable<any> {
        return this.http.get('/api/dataset').map(res => res.json());
    }


    countDataSet(): Observable<any> {
        return this.http.get('/api/dataset/count').map(res => res.json());
    }
    count_Manager(): Observable<any> {
        return this.http.get(this.url + '/api/dataset/count_Manager').map(res => res.json());
    }

    count_Seniorite(): Observable<any> {
        return this.http.get(this.url + '/api/dataset/count_Seniorite').map(res => res.json());
    }

    count_SITUATION_FAMILIALE(): Observable<any> {
        return this.http.get(this.url + '/api/dataset/count_SITUATION_FAMILIALE').map(res => res.json());
    }

    addDataSet(dataset): Observable<any> {
        console.log(JSON.stringify(dataset));
        console.log(JSON.stringify(this.options));
        return this.http.post(this.url + '/api/dataset', JSON.stringify(dataset), this.options);
    }

 validerDescription(description): Observable<any> {
    console.log(JSON.stringify(description));
    console.log(JSON.stringify(this.options));
    return this.http.post(this.url + '/api/dataset/description', JSON.stringify(description), this.options);
  }
 /*
  validerDescription(dataset): Observable<any> {
    return this.http.get(this.url + `/api/dataset/description`).map(res => res.json());
  }
  */
    getDataSet(dataset): Observable<any> {
        return this.http.get(`/api/dataset/${dataset._id}`).map(res => res.json());
    }

    getDataSetbyName(dataset): Observable<any> {
        return this.http.get(`/api/datasets/${dataset.name}`).map(res => res.json());
    }


    getDataSetbyMatricule(dataset): Observable<any> {
        return this.http.get(`http://localhost:3000/api/datasetsMat/${dataset.Matricule}`).map(res => res.json());
    }

    predictionPerPerson(dataset): Observable<any> {
        return this.http.get(`http://localhost:3000/api/predictionPerPerson/${dataset.Matricule}`).map(res => res.json());
    }

    editDataSet(dataset): Observable<any> {
        return this.http.put(this.url + `/api/dataset/${dataset._id}`, JSON.stringify(dataset), this.options);
    }

    deleteDataSet(dataset): Observable<any> {
        return this.http.delete(this.url + `/api/dataset/${dataset.Matricule}`, this.options);
    }

}
