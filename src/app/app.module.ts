import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductComponent } from './components/product/product.component';
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import { NavComponent } from './share/nav/nav.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SupplierComponent } from './components/supplier/supplier.component';
import { BuyComponent } from './components/buy/buy.component';
import { SaleComponent } from './components/sale/sale.component';
import { TitleComponent } from './components/title/title.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';


@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    NavComponent,
    LoginComponent,
    SupplierComponent,
    BuyComponent,
    SaleComponent,
    TitleComponent,
    SearchBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
