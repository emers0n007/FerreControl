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
  constructor( private router: Router, private authService: AuthenticationService) { }

  ngOnDestroy(): void {
   
  }

  ngOnInit(): void {
  
  }


  manageInventory(){
    this.router.navigateByUrl('product')
  }

  manageSupplier(){
    this.router.navigateByUrl('manage-supplier')
  }

  report(){
    this.router.navigateByUrl('report')
  }

  exit(){
    this.authService.cerrarSesion();
    this.router.navigateByUrl('login')
  }

}
