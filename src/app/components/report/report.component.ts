import { Component, OnInit } from '@angular/core';
import { BuyModel } from 'src/app/model/BuyModel';
import { SaleModel } from 'src/app/model/SaleModel';
import { BuyService } from 'src/app/service/buy.service';
import { SaleService } from 'src/app/service/sale.service';
import { PdfService } from 'src/app/service/pdf.service';
import { AlertService } from 'src/app/service/alert.service';
import { ProductModel } from 'src/app/model/ProductModel';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {
  reports = [
    { value: 'totalInventory', label: 'Total Inventario' },
    { value: 'totalSales', label: 'Total Ventas' },
    { value: 'totalPurchases', label: 'Total Compras' },
  ];

  buys: BuyModel[] = [];
  sales: SaleModel[] = [];

  reportName: string = '####';
  reportId: string = 'N#';

  saleSelect: SaleModel;
  buySelect: BuyModel;

  clientName: string = '';
  document: number = 0;
  money: number = 0;
  total: number = 0;

  reportTotal: boolean = false;
  reportTotalSale: boolean = false;
  reportTotalBuy: boolean = false;

  listProduct: ProductModel[] = [];

  private readonly AUTH_USER = 'No debe estar aqui';

  constructor(
    private _buyService: BuyService,
    private _saleService: SaleService,
    private _pdfService: PdfService,
    private _alertService: AlertService,
    private _productService: ProductService
  ) {}

  ngOnInit(): void {
    this.getBuys();
    this.getSales();
    this.listProducts();
  }

  setDetailsClient() {}

  createUserAux() {
    const user = {
      name_user: localStorage.getItem(this.AUTH_USER),
    };
    return user;
  }

  listProducts() {
    this._productService
      .getProducts(this.createUserAux().name_user)
      .subscribe((resp) => {
        if (resp) {
          this.listProduct = resp;
        }
      });
  }

  selectReport(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.resetTwoReports();
    this.reportName = 'Contabilidad';

    switch (selectedValue) {
      case 'totalInventory':
        this.generateTotalInventoryReport();
        break;
      case 'totalSales':
        this.generateTotalSalesReport();
        break;
      case 'totalPurchases':
        this.generateTotalPurchasesReport();
        break;
      default:
        break;
    }
  }

  resetTwoReports() {
    this.buySelect = null;
    this.saleSelect = null;
  }

  generateTotalInventoryReport() {
    this.reportTotal = true;
    this.reportTotalBuy = false;
    this.reportTotalSale = false;
    this.reportId = 'Inventario';
  }

  generateTotalSalesReport() {
    this.reportTotal = false;
    this.reportTotalBuy = false;
    this.reportTotalSale = true;
    this.reportId = 'Venta';
  }

  generateTotalPurchasesReport() {
    this.reportTotal = false;
    this.reportTotalBuy = true;
    this.reportTotalSale = false;
    this.reportId = 'Compra';
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
      if (this.clientName === '') {
        this.clientName = 'Cliente Generico';
      }
      if (this.document == 0) {
        this.document = 7777777;
      }
      this._pdfService.setValues(this.clientName, this.document, this.money);
      this.downloadPdfSale();
    } else if (this.reportTotal) {
      this._pdfService.showTotalInventory(this.listProduct, true);
    } else if (this.reportTotalBuy) {
      this._pdfService.showTotalBuy(this.buys, true);
    } else if (this.reportTotalSale) {
      this._pdfService.showTotalSale(this.sales, true);
    } else {
      this.showAlert('No se ha seleccionado un reporte valido', false);
    }
  }

  showPdf() {
    if (this.buySelect) {
      this.showPdfBuy();
    } else if (this.saleSelect) {
      if (this.clientName === '') {
        this.clientName = ' Cliente Generico';
      }
      if (this.document == 0) {
        this.document = 7777777;
      }
      this._pdfService.setValues(this.clientName, this.document, this.money);
      this.showPdfSale();
    } else if (this.reportTotal) {
      this._pdfService.showTotalInventory(this.listProduct, false);
    } else if (this.reportTotalBuy) {
      this._pdfService.showTotalBuy(this.buys, false);
    } else if (this.reportTotalSale) {
      this._pdfService.showTotalSale(this.sales, false);
    } else {
      this.showAlert('No se ha seleccionado un reporte valido', false);
    }
  }

  getBuys(): void {
    this._buyService
      .getBuys(this.createUserAux().name_user)
      .subscribe((buys) => {
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
      this.reportTotal = false;
      this.reportTotalBuy = false;
      this.reportTotalSale = false;
    }
  }

  getSales(): void {
    this._saleService
      .getSales(this.createUserAux().name_user)
      .subscribe((sales) => {
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
      this.reportTotal = false;
      this.reportTotalBuy = false;
      this.reportTotalSale = false;
    }
  }

  calculateTotalSale(productsFact: ProductModel[]): number {
    let total: number = 0;
    for (let i = 0; i < productsFact.length; i++) {
      total += productsFact[i].quantity * productsFact[i].price_sale;
    }
    return total;
  }

  showAlert(message: string, okay: boolean) {
    this._alertService.showAlert(message, okay);
  }
}
