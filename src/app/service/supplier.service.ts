import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {SupplierModel} from "../model/SupplierModel";

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  constructor(private httpClient:HttpClient) { }

  getSupplier(request2:string): Observable<SupplierModel[]>{
    const headers = new HttpHeaders().set('name_user', request2);
    return this.httpClient.get<SupplierModel[]>('http://localhost:9000/FerreControl' + '/list/supplier',{headers}).pipe(map(res => res));
  }
  saveSupplier(request: any,request2:string): Observable<any>{
    const headers = new HttpHeaders().set('name_user', request2);
    return this.httpClient.post<any>('http://localhost:9000/FerreControl' + '/save/supplier', request, {headers}).pipe(map(resp => resp));
  }

  updateSupplier(request: any,request2:string): Observable<any>{
    const headers = new HttpHeaders().set('name_user', request2);
    return this.httpClient.post<any>('http://localhost:9000/FerreControl' + '/update/supplier', request, {headers}).pipe(map(resp => resp));
  }

  deleteSupplier(id: number,request2:string): Observable<any>{
    const headers = new HttpHeaders().set('name_user', request2);
    return this.httpClient.get<any>('http://localhost:9000/FerreControl' + '/delete/supplier/'+ id).pipe(map(resp => resp));
  }
}
