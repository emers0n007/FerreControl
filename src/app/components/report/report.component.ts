import { Component, OnInit } from '@angular/core';
import { BuyModel } from 'src/app/model/BuyModel';
import { SaleModel } from 'src/app/model/SaleModel';
import { SupplierModel } from 'src/app/model/SupplierModel';
import { BuyService } from 'src/app/service/buy.service';
import { SaleService } from 'src/app/service/sale.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit{
  buys: BuyModel[] = [];
  sales: SaleModel[] = [];

  constructor(private _buyService: BuyService, private _saleService: SaleService){}

  ngOnInit(): void {
    this.getBuys();
    this.getSales();
  }

  getBuys(): void {
    this._buyService.getBuys().subscribe(buys => {
      this.buys = buys;
      console.log('Buys:', this.buys);
    });
  }

  getSales(): void {
    this._saleService.getSales().subscribe(sales => {
      this.sales = sales;
      console.log('sales:', this.sales);
    });
  }
}
