import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './components/product/product.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './service/authguard.service';

const routes: Routes = [
  {path:'',redirectTo:'/login', pathMatch:'full'},
  {path:'login',component:LoginComponent},
  {path:'product',component:ProductComponent, canActivate: [AuthGuard]},
  
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
