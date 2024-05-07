import { Component, OnInit } from '@angular/core';
import { BuyModel } from 'src/app/model/BuyModel';
import { SaleModel } from 'src/app/model/SaleModel';
import { BuyService } from 'src/app/service/buy.service';
import { SaleService } from 'src/app/service/sale.service';
import { PdfService } from 'src/app/service/pdf.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {

  buys: BuyModel[] = [];
  sales: SaleModel[] = [];

  reportName: string = "####";
  reportId: string = "####";

  saleSelect: SaleModel;
  buySelect: BuyModel;
  //91010777-8
  /*
  y lo de las facturas: Nombre de la ferretería, NIT, factura de venta de caja, fecha y hora, articulo, código, descripción y valor, resumen de IVA (opcional), recibido (plata dada por el cliente), total a pagar, cambio, TOTAL (grande)
  */

  constructor(
    private _buyService: BuyService,
    private _saleService: SaleService,
    private _pdfService: PdfService
  ) {}

  ngOnInit(): void {
    this.getBuys();
    this.getSales();
  }

  showPdfBuy(){
    if(this.buySelect){
      this._pdfService.showPdfBuy(this.buySelect);
    }
  }

  downloadPdfBuy(){
    if(this.buySelect){
      this._pdfService.downloadPdfBuy(this.buySelect);
    }
  }

  downloadPdf(){

  }

  showPdf() {

  }


  getBuys(): void {
    this._buyService.getBuys().subscribe((buys) => {
      this.buys = buys;
      console.log('Buys:', this.buys);
    });
  }



  selectBuy(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedId = target.value;
    this.buySelect = this.buys.find(
      (compra) => compra.id_buy + '' === selectedId
    );
    if(this.buySelect){
      this.reportName = "Entrada";
      this.reportId = this.buySelect.id_buy+"";
      this.saleSelect = null;
    }

    console.log(this.buySelect);
  }

  getSales(): void {
    this._saleService.getSales().subscribe((sales) => {
      this.sales = sales;
      console.log('sales:', this.sales);
    });
  }



  selectSale(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedId = target.value;
    this.saleSelect = this.sales.find(
      (compra) => compra.id_sale + '' === selectedId
    );
    if(this.saleSelect){
      this.reportName = "Salida";
      this.reportId = this.saleSelect.id_sale+"";
      this.buySelect = null;
    }
    console.log(this.saleSelect);
  }
}
