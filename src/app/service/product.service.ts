import { Injectable } from '@angular/core';
import {catchError, map, Observable, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {ProductModel} from "../model/ProductModel";
import {MarkModel} from "../model/MarkModel";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private httpClient:HttpClient) { }

  getProducts(request:string): Observable<ProductModel[]>{
    const headers = new HttpHeaders().set('name_user', request);
    return this.httpClient.get<ProductModel[]>('http://localhost:9000/FerreControl' + '/list/product',{headers}).pipe(map(res => res));
  }

  getProductoLowStock(request:string): Observable<ProductModel[]>{
    const headers = new HttpHeaders().set('name_user', request);
    return this.httpClient.get<ProductModel[]>('http://localhost:9000/FerreControl' + '/low/product', {headers}).pipe(map(res => res));
  }

  getMarks(): Observable<MarkModel[]>{
    return this.httpClient.get<MarkModel[]>('http://localhost:9000/FerreControl' + '/list/mark').pipe(map(res => res));
  }

  saveMark(request: any): Observable<MarkModel[]>{
    return this.httpClient.post<MarkModel[]>('http://localhost:9000/FerreControl' + '/save/mark', request).pipe(map(resp => resp));
  }
  saveProduct(request: any,request2:string): Observable<any>{
    const headers = new HttpHeaders().set('name_user', request2);
    return this.httpClient.post<any>('http://localhost:9000/FerreControl' + '/save/product', request,{headers}).pipe(map(resp => resp,
      catchError(this.handleError)));

  }

  updateProduct(request: any, request2:any): Observable<any>{
    const headers = new HttpHeaders().set('name_user', request2);
    return this.httpClient.post<any>('http://localhost:9000/FerreControl' + '/update/product', request,{headers}).pipe(map(resp => resp));
  }

  deleteProduct(id: number, request2:string): Observable<any>{
    const headers = new HttpHeaders().set('name_user', request2);
    return this.httpClient.get<any>('http://localhost:9000/FerreControl' + '/delete/product/'+ id,{headers}).pipe(map(resp => resp));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Ocurrió un error:', error.error.message);
    } else {
      console.error(
        `Código de error: ${error.status}, ` +
        `mensaje: ${error.error}`);
    }
    return throwError('Ocurrió un error. Por favor, inténtelo de nuevo más tarde.');
  }
}

