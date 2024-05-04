import { Injectable } from '@angular/core';
import {map, Observable} from "rxjs";
import {SupplierModel} from "../model/SupplierModel";
import {HttpClient} from "@angular/common/http";
import {SaleModel} from "../model/SaleModel";

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(private httpClient:HttpClient) { }

  getSales(): Observable<SaleModel[]>{
    return this.httpClient.get<SaleModel[]>('http://localhost:9000/FerreControl' + '/list/sale').pipe(map(res => res));
  }
  saveSupplier(request: any): Observable<any>{
    return this.httpClient.post<any>('http://localhost:9000/FerreControl' + '/save/sale', request).pipe(map(resp => resp));
  }
}
