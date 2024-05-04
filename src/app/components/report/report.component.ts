import { Component, OnInit } from '@angular/core';
import { BuyModel } from 'src/app/model/BuyModel';
import { SupplierModel } from 'src/app/model/SupplierModel';
import { BuyService } from 'src/app/service/buy.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit{
  buys: BuyModel[] = [];

  constructor(private _buyService: BuyService){}

  ngOnInit(): void {
    this.getBuys();
    console.log(this.buys);
  }

  getBuys(): void {
    this._buyService.getBuys().subscribe(buys => {
      this.buys = buys;
      console.log('Buys:', this.buys);
    });
  }
}
