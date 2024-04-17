import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';
import {UserModel} from "../../model/Users";
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
  ) {}

  userOkay:UserModel[] = []


  ngOnInit(): void {
    this.listUsers();
    this.authService.cerrarSesion();
    this.formLogin = new FormGroup({
    user: new FormControl(''),
    password: new FormControl('')
  });
  }

  listUsers(){
    this.authService.listUsers().subscribe(resp=> {
      if (resp) {
        this.userOkay = resp;
        }
    });
  }

  login() {
    console.log('Usuarios obtenidos:', this.userOkay); // Aquí imprimes userOkay
    const userName = this.formLogin.controls['user'].value;
    const password = this.formLogin.controls['password'].value;

    const usuarioValido = this.userOkay.find(
      (u) => u.name_user === userName && u.password === password
    );

    if (usuarioValido) {
      if (this.formLogin.controls['user'].value === 'admin'){
        this.authService.setUserAdmin();
      }else{
        this.authService.setUserGerent();
      }
      this.mensaje = 'Inicio Correcto';
      this.authService.autenticarUsuario();
      this.router.navigateByUrl('/product');
      localStorage.setItem('activeButton', 'Gestionar Productos')
    } else {
      // Usuario no válido, mostrar un mensaje de error o realizar otras acciones
      this.mensaje = 'Usuario o contraseña incorrectos';
    }
  }
}
