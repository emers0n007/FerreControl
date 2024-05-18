import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {UserModel} from "../model/Users";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private httpClient:HttpClient) { }

  getUsers(): Observable<UserModel[]>{
    return this.httpClient.get<UserModel[]>('http://localhost:9000/FerreControl' + '/list/user').pipe(map(res => res));
  }
  saveUser(request: any): Observable<any>{
    return this.httpClient.post<any>('http://localhost:9000/FerreControl' + '/save/user', request).pipe(map(resp => resp));
  }


  deleteSupplier(id: String): Observable<any>{
    return this.httpClient.get<any>('http://localhost:9000/FerreControl' + '/delete/user/'+ id).pipe(map(resp => resp));
  }
}
