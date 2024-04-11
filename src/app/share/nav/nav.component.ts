import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {
  userLoginOn:boolean=false;
  usuario: string = this.authService.getUserActual();
  botonActivo: string = 'Gestionar Productos';

  constructor( private router: Router, private authService: AuthenticationService) { }


  activarBoton(boton: string) {
    this.botonActivo = boton;
  }

  ngOnDestroy(): void {

  }

  ngOnInit(): void {

  }


  manageInventory(){
    this.router.navigateByUrl('product')
  }
  manageBuy(){
    this.router.navigateByUrl('buy')
  }

  manageSale(){
    this.router.navigateByUrl('sale')
  }

  manageSupplier(){
    this.router.navigateByUrl('supplier')
  }

  report(){
    this.router.navigateByUrl('report')
  }

  exit(){
    this.authService.cerrarSesion();
    this.router.navigateByUrl('login')
  }

}
