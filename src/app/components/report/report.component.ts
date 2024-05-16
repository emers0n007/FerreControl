import { Component, OnInit } from '@angular/core';
import { BuyModel } from 'src/app/model/BuyModel';
import { SaleModel } from 'src/app/model/SaleModel';
import { BuyService } from 'src/app/service/buy.service';
import { SaleService } from 'src/app/service/sale.service';
import { PdfService } from 'src/app/service/pdf.service';
import { AlertService } from 'src/app/service/alert.service';
import { ProductModel } from 'src/app/model/ProductModel';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {

  buys: BuyModel[] = [];
  sales: SaleModel[] = [];

  reportName: string = '####';
  reportId: string = 'N#';

  saleSelect: SaleModel;
  buySelect: BuyModel;

  clientName: string = "";
  document: number = 0;
  money: number = 0;
  total: number = 0;

  constructor(
    private _buyService: BuyService,
    private _saleService: SaleService,
    private _pdfService: PdfService,
    private _alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.getBuys();
    this.getSales();
  }

  setDetailsClient(){

  }

  showPdfBuy() {
    if (this.buySelect) {
      this._pdfService.showPdfBuy(this.buySelect);
    }
  }

  showPdfSale() {
    if (this.saleSelect) {
      this._pdfService.showPdfSale(this.saleSelect);
    }
  }

  downloadPdfBuy() {
    if (this.buySelect) {
      this._pdfService.downloadPdfBuy(this.buySelect);
    }
  }

  downloadPdfSale() {
    if (this.saleSelect) {
      this._pdfService.downloadPdfSale(this.saleSelect);
    }
  }

  downloadPdf() {
    if (this.buySelect) {
      this.downloadPdfBuy();
    } else if (this.saleSelect) {
      if(this.clientName === ""){
        this.clientName = "Cliente Generico"
      }
      if(this.document == 0){
        this.document = 7777777;
      }
      this._pdfService.setValues(this.clientName, this.document, this.money);
      this.downloadPdfSale();
    }else {
      this.showAlert("No se ha seleccionado un reporte valido", false);
    }
  }

  showPdf() {
    if (this.buySelect) {
      this.showPdfBuy();
    } else if (this.saleSelect) {
      if(this.clientName === ""){
        this.clientName = " Cliente Generico"
      }
      if(this.document == 0){
        this.document = 7777777;
      }
      this._pdfService.setValues(this.clientName, this.document, this.money);
      this.showPdfSale();
    }else {
      this.showAlert("No se ha seleccionado un reporte valido", false);
    }
  }

  getBuys(): void {
    this._buyService.getBuys().subscribe((buys) => {
      this.buys = buys;
    });
  }

  selectBuy(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedId = target.value;
    this.buySelect = this.buys.find(
      (compra) => compra.id_buy + '' === selectedId
    );
    if (this.buySelect) {
      this.reportName = 'Entrada';
      this.reportId = this.buySelect.id_buy + '';
      this.saleSelect = null;
    }

    console.log(this.buySelect);
  }

  getSales(): void {
    this._saleService.getSales().subscribe((sales) => {
      this.sales = sales;
    });
  }

  selectSale(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedId = target.value;
    this.saleSelect = this.sales.find(
      (compra) => compra.id_sale + '' === selectedId
    );
    if (this.saleSelect) {
      this.total = this.calculateTotalSale(this.saleSelect.saleDetail);
      this.reportName = 'Salida';
      this.reportId = this.saleSelect.id_sale + '';
      this.buySelect = null;
    }
    console.log(this.saleSelect);
  }

  calculateTotalSale(productsFact: ProductModel[]): number {
    let total: number = 0;
    for (let i = 0; i < productsFact.length; i++) {
      console.log(productsFact[i].quantity, productsFact[i].price_sale);
      total += productsFact[i].quantity * productsFact[i].price_sale;
    }
    return total;
  }

  showAlert(message: string, okay: boolean) {
    this._alertService.showAlert(message, okay);
  }
}
