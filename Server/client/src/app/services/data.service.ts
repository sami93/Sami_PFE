import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Issue} from '../models/issue';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {PredictionIssue} from '../models/predictionIssue';

@Injectable()
export class DataService {
    private readonly API_URL_Ancien = 'https://api.github.com/repos/angular/angular/issues';
    private readonly API_URL_Prediction = 'http://localhost:3000/api/predictions';
    private readonly API_URL = 'http://localhost:3000/api/dataset';
    private readonly API_URL_MatriculeOnePrediction = 'http://localhost:3000/api/predictionMat/';
    dataChangePrediction: BehaviorSubject<PredictionIssue[]> = new BehaviorSubject<PredictionIssue[]>([]);
    dataChange: BehaviorSubject<Issue[]> = new BehaviorSubject<Issue[]>([]);
    // Temporarily stores data from dialogs
    dialogData: any;
    dataChangePredictionByMatricule: BehaviorSubject<PredictionIssue[]> = new BehaviorSubject<PredictionIssue[]>([]);

    constructor(private httpClient: HttpClient) {
    }

    get data(): any[] {
        return this.dataChange.value;
    }

    get dataPrediction(): any[] {
        return this.dataChangePrediction.value;
    }

    get dataPredictionByMatricule(): any[] {
        return this.dataChangePredictionByMatricule.value;
    }

    getDialogData() {
        return this.dialogData;
    }

    /** CRUD METHODS */
    getAllIssues(): void {
        this.httpClient.get<Issue[]>(this.API_URL).subscribe(data => {
                this.dataChange.next(data);
            },
            (error: HttpErrorResponse) => {
                console.log(error.name + ' ' + error.message);
            });
    }

    getAllPredictionIssue(): void {
        this.httpClient.get<PredictionIssue[]>(this.API_URL_Prediction).subscribe(data => {
                this.dataChangePrediction.next(data);
            },
            (error: HttpErrorResponse) => {
                console.log(error.name + ' ' + error.message);
            });
    }

    getPredictionByMatricule(predictionMatricule): void {
        this.httpClient.get<any>(this.API_URL_MatriculeOnePrediction + `${predictionMatricule}`).subscribe(res => {
                this.dataChangePredictionByMatricule.next(res.date_predict);
            },
            (error: HttpErrorResponse) => {
                console.log(error.name + ' ' + error.message);
            });
    }

    // DEMO ONLY, you can find working methods below
    addIssue(issue: Issue): void {
        this.dialogData = issue;
    }

    updateIssue(issue: Issue): void {
        this.dialogData = issue;
    }

    deleteIssue(id: number): void {
        console.log(id);
    }
}


/* REAL LIFE CRUD Methods I've used in my projects. ToasterService uses Material Toasts for displaying messages:

    // ADD, POST METHOD
    addItem(kanbanItem: KanbanItem): void {
    this.httpClient.post(this.API_URL, kanbanItem).subscribe(data => {
      this.dialogData = kanbanItem;
      this.toasterService.showToaster('Successfully added', 3000);
      },
      (err: HttpErrorResponse) => {
      this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
    });
   }

    // UPDATE, PUT METHOD
     updateItem(kanbanItem: KanbanItem): void {
    this.httpClient.put(this.API_URL + kanbanItem.id, kanbanItem).subscribe(data => {
        this.dialogData = kanbanItem;
        this.toasterService.showToaster('Successfully edited', 3000);
      },
      (err: HttpErrorResponse) => {
        this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );
  }

  // DELETE METHOD
  deleteItem(id: number): void {
    this.httpClient.delete(this.API_URL + id).subscribe(data => {
      console.log(data['']);
        this.toasterService.showToaster('Successfully deleted', 3000);
      },
      (err: HttpErrorResponse) => {
        this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );
  }
*/




