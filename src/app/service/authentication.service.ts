
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
  private readonly AUTH_KEY = 'false';
  private readonly AUTH_USER = 'No debe estar aqui';
  private readonly AUTH_ROLE = 'Rol Invalido';
  private readonly AUTH_USERNAME = 'Desconocido';



  login(username: string, password: string): Observable<any> {
    const body = { name_user: username, password: password };
    return this.httpClient.post<any>('http://localhost:9000/FerreControl/login', body).pipe(
      tap((resp: any) => {
        localStorage.setItem(this.AUTH_USER, resp.name_user);
        localStorage.setItem(this.AUTH_ROLE, resp.role);
        localStorage.setItem(this.AUTH_USERNAME, resp.name);
        })
    );
  }

  exit(): Observable<any> {
    const body = { name_user: localStorage.getItem(this.AUTH_USER), password: '0' };
    return this.httpClient.post<any>('http://localhost:9000/FerreControl/exit', body);
  }


    getUserActual(): string{
      return this.isUser();
    }

  getNameUser(): string{
    return this.getNameuser();
  }

  getRoleActual(): string{
    return this.isRole();
  }



  private isAuthenticated(): boolean {
    return localStorage.getItem(this.AUTH_KEY) === 'true';
  }

  private isUser(): string {
    return localStorage.getItem(this.AUTH_USER) ?? "No debe estar aqui";
  }

  private isRole(): string {
    return localStorage.getItem(this.AUTH_ROLE) ?? "Rol Invalido";
  }

  private getNameuser(): string {
    return localStorage.getItem(this.AUTH_USERNAME) ?? "Nombre Invalido";
  }

  usuarioAutenticado = this.isAuthenticated();
  autenticarUsuario() {
    localStorage.setItem(this.AUTH_KEY, 'true');
    this.usuarioAutenticado = true;
  }

  cerrarSesion(): void {
    this.exit().subscribe({
      next: () => {
        localStorage.setItem(this.AUTH_KEY, 'false');
        localStorage.setItem(this.AUTH_USER, "No debe estar aqui");
        localStorage.setItem(this.AUTH_ROLE, "Rol Invalido");
        this.usuarioAutenticado = false;
      },
      error: (err) => {
        console.error('Error during exit:', err);
        // Manejar el error aquí si es necesario
      }
    });
  }



}
