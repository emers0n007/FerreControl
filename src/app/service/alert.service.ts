import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

    
  private alertSource = new Subject<{ message: string; okay: boolean; time: number }>();
  alert$ = this.alertSource.asObservable();

  
  constructor() { }

  showAlert(message: string, okay: boolean,time: number = 4000){
    this.alertSource.next({message, okay, time});
  }
}
