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
    return this.httpClient.get<ProductModel[]>('http://localhost:9000/FerreControl' + '/list').pipe(map(res => res));
  }
  saveProduct(request: any): Observable<any>{
    return this.httpClient.post<any>('http://localhost:9000/FerreControl' + '/save', request).pipe(map(resp => resp));
  }

  updateProduct(request: any): Observable<any>{
    return this.httpClient.post<any>('http://localhost:9000/FerreControl' + '/update', request).pipe(map(resp => resp));
  }

  deleteProduct(id: number): Observable<any>{
    return this.httpClient.get<any>('http://localhost:9000/FerreControl' + '/delete/'+ id).pipe(map(resp => resp));
  }
}

/*
// Generar un ID aleatorio entre 1 y 1000
const id = Math.floor(Math.random() * 1000) + 1;

// Crear el objeto con el ID aleatorio
const requestBody = {
  "id": id
};

// Establecer el cuerpo de la solicitud con el objeto JSON generado
pm.request.body.raw = JSON.stringify(requestBody);

// Imprimir el cuerpo de la solicitud en la consola de Postman para verificar
console.log("Cuerpo de la solicitud:", pm.request.body.raw);
*/