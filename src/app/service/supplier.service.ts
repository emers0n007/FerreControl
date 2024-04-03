import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {SupplierModel} from "../model/SupplierModel";

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  constructor(private httpClient:HttpClient) { }

  getSupplier(): Observable<SupplierModel[]>{
    return this.httpClient.get<SupplierModel[]>('http://localhost:9000/FerreControl' + '/list/supplier').pipe(map(res => res));
  }
  saveSupplier(request: any): Observable<any>{
    return this.httpClient.post<any>('http://localhost:9000/FerreControl' + '/save/supplier', request).pipe(map(resp => resp));
  }

  updateSupplier(request: any): Observable<any>{
    return this.httpClient.post<any>('http://localhost:9000/FerreControl' + '/update/supplier', request).pipe(map(resp => resp));
  }

  deleteSupplier(id: number): Observable<any>{
    return this.httpClient.get<any>('http://localhost:9000/FerreControl' + '/delete/supplier/'+ id).pipe(map(resp => resp));
  }
}
