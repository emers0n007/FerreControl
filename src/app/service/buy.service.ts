import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable} from "rxjs";
import { BuyModel } from '../model/BuyModel';

@Injectable({
  providedIn: 'root'
})
export class BuyService {

  constructor(private httpClient:HttpClient) { }

  getBuys(request2:string): Observable<BuyModel[]>{
    const headers = new HttpHeaders().set('name_user', request2);
    return this.httpClient.get<BuyModel[]>('http://localhost:9000/FerreControl' + '/list/buy', {headers}).pipe(map(res => res));
  }
  saveBuy(request: any,request2:string): Observable<any>{
    const headers = new HttpHeaders().set('name_user', request2);
    return this.httpClient.post<any>('http://localhost:9000/FerreControl' + '/save/buy', request, {headers}).pipe(map(resp => resp));
  }


}
