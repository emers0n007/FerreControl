// authentication.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
 
  userActual = "NN"


  setUserAdmin(){
    this.userActual = "Administrador"
  }

  setUserGerent(){
    this.userActual = "Gerente Financiero"
  }

    getUserActual(): string{
      return this.userActual;
    }

  private readonly AUTH_KEY = 'authenticated';
  usuarioAutenticado = false;

  autenticarUsuario() {
    localStorage.setItem(this.AUTH_KEY, 'true');
    this.usuarioAutenticado = true;
  }

  cerrarSesion() {
    localStorage.setItem(this.AUTH_KEY, 'false');
    this.usuarioAutenticado = false;
  }

   private isAuthenticated(): boolean {
    return localStorage.getItem(this.AUTH_KEY) === 'true';
  }
  
}
