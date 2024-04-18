import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {SupplierModel} from "../model/SupplierModel";

@Injectable({
  providedIn: 'root'
})
export class BuyService {

  constructor(private httpClient:HttpClient) { }

  getBuys(): Observable<SupplierModel[]>{
    return this.httpClient.get<SupplierModel[]>('http://localhost:9000/FerreControl' + '/list/buy').pipe(map(res => res));
  }
  saveBuy(request: any): Observable<any>{
    return this.httpClient.post<any>('http://localhost:9000/FerreControl' + '/save/buy', request).pipe(map(resp => resp));
  }
}
