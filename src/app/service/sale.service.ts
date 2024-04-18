import { Injectable } from '@angular/core';
import {map, Observable} from "rxjs";
import {SupplierModel} from "../model/SupplierModel";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(private httpClient:HttpClient) { }

  getBuys(): Observable<SupplierModel[]>{
    return this.httpClient.get<SupplierModel[]>('http://localhost:9000/FerreControl' + '/list/buy').pipe(map(res => res));
  }
  saveSupplier(request: any): Observable<any>{
    return this.httpClient.post<any>('http://localhost:9000/FerreControl' + '/save/buy', request).pipe(map(resp => resp));
  }
}
