// authentication.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
 
  userActual = "NN"
  private readonly AUTH_KEY = 'true';
  private readonly AUTH_USER = 'No debe estar aqui';

  setUserAdmin(){
    this.userActual = "Administrador"
    localStorage.setItem(this.AUTH_USER, 'Administrador');
    console.log(localStorage.getItem(this.AUTH_USER));
  }

  setUserGerent(){
    this.userActual = "Gerente Financiero"
    localStorage.setItem(this.AUTH_USER, 'Gerente Financiero');
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
