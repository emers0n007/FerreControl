import { Injectable } from '@angular/core';
import {catchError, map, Observable, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ProductModel} from "../model/ProductModel";
import {MarkModel} from "../model/MarkModel";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private httpClient:HttpClient) { }

  getProducts(): Observable<ProductModel[]>{
    return this.httpClient.get<ProductModel[]>('http://localhost:9000/FerreControl' + '/list/product').pipe(map(res => res));
  }

  getProductoLowStock(): Observable<ProductModel[]>{
    return this.httpClient.get<ProductModel[]>('http://localhost:9000/FerreControl' + '/low/product').pipe(map(res => res));
  }

  getMarks(): Observable<MarkModel[]>{
    return this.httpClient.get<MarkModel[]>('http://localhost:9000/FerreControl' + '/list/mark').pipe(map(res => res));
  }

  saveMark(request: any): Observable<MarkModel[]>{
    return this.httpClient.post<MarkModel[]>('http://localhost:9000/FerreControl' + '/save/mark', request).pipe(map(resp => resp));
  }
  saveProduct(request: any): Observable<any>{

    return this.httpClient.post<any>('http://localhost:9000/FerreControl' + '/save/product', request).pipe(map(resp => resp,
      catchError(this.handleError)));

  }

  updateProduct(request: any): Observable<any>{
    return this.httpClient.post<any>('http://localhost:9000/FerreControl' + '/update/product', request).pipe(map(resp => resp));
  }

  deleteProduct(id: number): Observable<any>{
    return this.httpClient.get<any>('http://localhost:9000/FerreControl' + '/delete/product/'+ id).pipe(map(resp => resp));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      console.error('Ocurrió un error:', error.error.message);
    } else {
      // Error del servidor
      console.error(
        `Código de error: ${error.status}, ` +
        `mensaje: ${error.error}`);
    }
    // Devuelve un observable con un mensaje de error legible para el usuario
    return throwError('Ocurrió un error. Por favor, inténtelo de nuevo más tarde.');
  }
}

