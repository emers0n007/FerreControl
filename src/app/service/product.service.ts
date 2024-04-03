import { Injectable } from '@angular/core';
import {map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ProductModel} from "../model/ProductModel";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private httpClient:HttpClient) { }

  getProducts(): Observable<ProductModel[]>{
    return this.httpClient.get<ProductModel[]>('http://localhost:9000/FerreControl' + '/list/product').pipe(map(res => res));
  }
  saveProduct(request: any): Observable<any>{
    return this.httpClient.post<any>('http://localhost:9000/FerreControl' + '/save/product', request).pipe(map(resp => resp));
  }

  updateProduct(request: any): Observable<any>{
    return this.httpClient.post<any>('http://localhost:9000/FerreControl' + '/update/product', request).pipe(map(resp => resp));
  }

  deleteProduct(id: number): Observable<any>{
    return this.httpClient.get<any>('http://localhost:9000/FerreControl' + '/delete/product/'+ id).pipe(map(resp => resp));
  }
}

