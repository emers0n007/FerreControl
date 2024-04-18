// authentication.service.ts
import { Injectable } from '@angular/core';
import {map, Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {UserModel} from "../model/Users";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private httpClient:HttpClient) {
  }
  userActual = "NN"
  private readonly AUTH_KEY = 'true';
  private readonly AUTH_USER = 'No debe estar aqui';
  private readonly AUTH_USERNAME = 'Desconocido';

  setUserAdmin(){
    this.userActual = "Administrador"
  }

  login(username: string, password: string): Observable<any> {
    const body = { name_user: username, password: password };
    return this.httpClient.post<any>('http://localhost:9000/FerreControl/login', body).pipe(
      tap((resp: any) => {
        localStorage.setItem(this.AUTH_USER, resp.role);
        localStorage.setItem(this.AUTH_USERNAME, resp.name);
        })
    );
  }


  setUserGerent(){
    this.userActual = "Gerente Financiero"
    localStorage.setItem(this.AUTH_USER, 'Gerente Financiero');
    localStorage.setItem(this.AUTH_USERNAME, 'Juanito');
  }

    getUserActual(): string{
      return this.isUser();

    }



  private isAuthenticated(): boolean {
    return localStorage.getItem(this.AUTH_KEY) === 'true';
  }

  private isUser(): string {
    return localStorage.getItem(this.AUTH_USER) ?? "No debe estar aqui";
  }

  usuarioAutenticado = this.isAuthenticated();
  autenticarUsuario() {
    localStorage.setItem(this.AUTH_KEY, 'true');
    this.usuarioAutenticado = true;
  }

  cerrarSesion() {
    localStorage.setItem(this.AUTH_KEY, 'false');
    localStorage.setItem(this.AUTH_USER,"No debe estar aqui");
    this.usuarioAutenticado = false;
  }



}
