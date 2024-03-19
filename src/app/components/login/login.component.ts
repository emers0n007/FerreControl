import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  userOkay = [
    { usuario: 'admin', password: '123' },
    { usuario: 'admin2', password: '123' },
  ];

  usuario: string | undefined;
  password: string | undefined;
  mensaje: string = '';

  ngOnInit(): void {}

  login() {
    const usuarioValido = this.userOkay.find(
      (u) => u.usuario === this.usuario && u.password === this.password
    );
    if (usuarioValido) {
      if (this.usuario === 'admin'){
        this.authService.setUserAdmin();
      }else{
        this.authService.setUserGerent();
      }
      this.mensaje = 'Inicio de sesión exitoso';
      this.authService.autenticarUsuario();
      this.router.navigateByUrl('/product');
    } else {
      // Usuario no válido, mostrar un mensaje de error o realizar otras acciones
      this.mensaje = 'Usuario o contraseña incorrectos';
    }
  }
}
