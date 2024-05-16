import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';
import {UserModel} from "../../model/Users";
import { ModalProductsLowService } from 'src/app/service/modal-products-low.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit{

  formLogin:FormGroup= new FormGroup({});
  mensaje:String = '';

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private modalService: ModalProductsLowService
  ) {}

  userOkay:UserModel[] = []


  ngOnInit(): void {
    this.authService.cerrarSesion();
    this.formLogin = new FormGroup({
    user: new FormControl(''),
    password: new FormControl('')
  });
  }


  login() {
    const userName = this.formLogin.controls['user'].value;
    const password = this.formLogin.controls['password'].value;
    this.authService.login(userName, password).subscribe({
      next: (usuarioValido: UserModel) => {
        if (usuarioValido.name!=null) {

          this.mensaje = 'Inicio Correcto';
          this.authService.autenticarUsuario();
          this.modalService.openModalDelayed();
          this.router.navigateByUrl('/product');
          localStorage.setItem('activeButton', 'Gestionar Productos');

        } else {
          this.mensaje = 'Usuario o contraseña incorrectos';
        }
      },
      error: (error: any) => {
        console.error('Error al autenticar:', error);
      }
    });

  }

}
