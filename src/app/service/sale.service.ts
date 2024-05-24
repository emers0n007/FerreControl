import { Injectable } from '@angular/core';
import {map, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SaleModel} from "../model/SaleModel";

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(private httpClient:HttpClient) { }

  getSales(request2:string): Observable<SaleModel[]>{
    const headers = new HttpHeaders().set('name_user', request2);
    return this.httpClient.get<SaleModel[]>('http://localhost:9000/FerreControl' + '/list/sale',{headers}).pipe(map(res => res));
  }
  saveSale(request: any, request2:string): Observable<any>{
    const headers = new HttpHeaders().set('name_user', request2);
    return this.httpClient.post<any>('http://localhost:9000/FerreControl' + '/save/sale', request,{headers}).pipe(map(resp => resp));
  }
  getSale(id: string, request2:string): Observable<SaleModel> {
    const headers = new HttpHeaders().set('name_user', request2);
    return this.httpClient.get<any>(`http://localhost:9000/FerreControl/search/sale/${id}`,{headers}).pipe(
      map(resp => {
        const sale = new SaleModel();
        sale.id_sale = resp.data.id_sale;
        sale.sale_date = new Date(resp.data.sale_date);
        sale.total_price = resp.data.total_price;
        sale.saleDetail = resp.data.saleDetail;
        sale.name_user = resp.data.name_user;
        return sale;
      })
    );
  }

}
