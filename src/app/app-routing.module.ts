import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './components/product/product.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './service/authguard.service';
import { SupplierComponent } from './components/supplier/supplier.component';
import {BuyComponent} from "./components/buy/buy.component";
import {SaleComponent} from "./components/sale/sale.component";

const routes: Routes = [
  {path:'',redirectTo:'/login', pathMatch:'full'},
  {path:'login',component:LoginComponent},
  {path:'product',component:ProductComponent, canActivate: [AuthGuard]},
  {path:'supplier',component:SupplierComponent, canActivate: [AuthGuard]},
  {path:'buy',component:BuyComponent, canActivate: [AuthGuard]},
  {path:'sale',component:SaleComponent, canActivate: [AuthGuard]}

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
