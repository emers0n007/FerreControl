import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import { saveAs } from 'file-saver';
import { BuyModel } from '../model/BuyModel';
import { ProductModel } from '../model/ProductModel';
import { formatDate } from '@angular/common';
import { SaleModel } from '../model/SaleModel';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class PdfService {

  clientName: string = "";
  document: number = 0;
  money: number = 0;

  listProduct: ProductModel[] = [];

  constructor() {
  }

  setValues(clientName: string, document: number, money: number): void {
    this.clientName = clientName;
    this.document = document;
    this.money = money;
  }

  showPdfBuy(buy: BuyModel) {
    const title = `Compra #${buy.id_buy}`;
    const establishment = 'Ferrecasa';
    const nit = 'NIT 91010777-8';
    const currentDate = formatDate(new Date(), 'yyyy/MM/dd HH:mm:ss', 'en-US');
    const totalPrice = this.formatCurrency(this.calculateTotalBuy(buy.buyDetail));
    const products = buy.buyDetail.map((product: ProductModel) => {
      const subtotal = product.quantity * product.price_buy;
      return [
        product.id_product,
        product.name,
        product.presentation.name_presentation,
        product.quantity,
        this.formatCurrency(product.price_buy),
        this.formatCurrency(subtotal),
      ];
    });

    const table = {
      table: {
        headerRows: 1,
        widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
        body: [
          ['Id', 'Articulo', 'Presentacion', 'Cantidad', 'Precio de Compra', 'Subtotal'],
          ...products,
        ],
      },
    };

    const pdfDefinition: any = {
      content: [
        {
          text: establishment,
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: nit,
          fontSize: 12,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: title,
          fontSize: 14,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: `Fecha generacion: ${currentDate}`,
          fontSize: 12,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        table,
        {
          text: `Total de la compra: ${totalPrice}`,
          fontSize: 18,
          alignment: 'right',
          margin: [0, 30, 0, 10],
        },
      ],
    };

    pdfMake.createPdf(pdfDefinition).getBlob((blob: any) => {
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      URL.revokeObjectURL(url);
    });
  }

  downloadPdfBuy(buy: BuyModel) {
    const title = `Compra #${buy.id_buy}`;
    const establishment = 'Ferrecasa';
    const nit = 'NIT 91010777-8';
    const currentDate = formatDate(new Date(), 'yyyy/MM/dd HH:mm:ss', 'en-US');
    const totalPrice = this.formatCurrency(this.calculateTotalBuy(buy.buyDetail));
    const products = buy.buyDetail.map((product: ProductModel) => {
      const subtotal = product.quantity * product.price_buy;
      return [
        product.id_product,
        product.name,
        product.presentation.name_presentation,
        product.quantity,
        this.formatCurrency(product.price_buy),
        this.formatCurrency(subtotal),
      ];
    });

    const table = {
      table: {
        headerRows: 1,
        widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
        body: [
          ['Id', 'Articulo', 'Presentacion', 'Cantidad', 'Precio de Compra', 'Subtotal'],
          ...products,
        ],
      },
    };

    const pdfDefinition: any = {
      content: [
        {
          text: establishment,
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: nit,
          fontSize: 12,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: title,
          fontSize: 14,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: `Fecha generacion: ${currentDate}`,
          fontSize: 12,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        table,
        {
          text: `Total de la compra: ${totalPrice}`,
          fontSize: 18,
          alignment: 'right',
          margin: [0, 30, 0, 10],
        },
      ],
    };

    pdfMake.createPdf(pdfDefinition).getBlob((blob: any) => {
      const fileName = `Compra_${buy.id_buy}.pdf`;
      saveAs(blob, fileName);
    });
  }
  showPdfSaleComponent(sale: SaleModel) {
    const title = `Venta #${sale.id_sale}`;
    const establishment = 'Ferrecasa';
    const nit = 'NIT 91010777-8';
    const currentDate = formatDate(new Date(), 'yyyy/MM/dd HH:mm:ss', 'en-US');
    const totalPrice = this.formatCurrency(this.calculateTotalSale(sale.saleDetail));
    const totalPriceNumber = this.calculateTotalSale(sale.saleDetail);
    const products = sale.saleDetail.map((product: ProductModel) => {
      const subtotal = product.quantity * product.price_sale;
      return [
        product.id_product,
        product.name,
        product.presentation.name_presentation,
        product.quantity,
        this.formatCurrency(product.price_sale),
        this.formatCurrency(subtotal)
      ];
    });

    const table = {
      table: {
        headerRows: 1,
        widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
        body: [
          ['Id', 'Articulo', 'Presentacion', 'Cantidad', 'Valor', 'Subtotal'],
          ...products,
        ],
      },
    };

    const pdfDefinition: any = {
      content: [
        {
          text: establishment,
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: nit,
          fontSize: 12,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: title,
          fontSize: 14,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        }, // Centra el título
        {
          text: `Fecha generacion: ${currentDate}`,
          fontSize: 12,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: `Cliente: ${this.clientName}`,
          fontSize: 12,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: `Documento cliente: ${this.document}`,
          fontSize: 12,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        table,
        {
          text: `Total: ${totalPrice}`,
          fontSize: 15,
          alignment: 'right',
          margin: [0, 20, 0, 10],
        },
        {
          text: `Valor pagado: ${this.formatCurrency(this.money)}`,
          fontSize: 15,
          alignment: 'right',
          margin: [0, 20, 0, 10],
        },
        {
          text: `Cambio: ${this.formatCurrency(this.money - totalPriceNumber)}`,
          fontSize: 14,
          alignment: 'right',
          margin: [0, 20, 0, 10],
        },
      ],
    };

    pdfMake.createPdf(pdfDefinition).getBlob((blob: any) => {
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      URL.revokeObjectURL(url);
    });
  }

  showPdfSale(sale: SaleModel) {
    const title = `Venta #${sale.id_sale}`;
    const establishment = 'Ferrecasa';
    const nit = 'NIT 91010777-8';
    const currentDate = formatDate(new Date(), 'yyyy/MM/dd HH:mm:ss', 'en-US');
    const totalPrice = this.formatCurrency(this.calculateTotalSale(sale.saleDetail));
    const products = sale.saleDetail.map((product: ProductModel) => {
      const subtotal = product.quantity * product.price_sale;
      return [
        product.id_product,
        product.name,
        product.presentation.name_presentation,
        product.quantity,
        this.formatCurrency(product.price_sale),
        this.formatCurrency(subtotal),
      ];
    });

    const table = {
      table: {
        headerRows: 1,
        widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
        body: [
          ['Id', 'Articulo', 'Presentacion', 'Cantidad', 'Valor', 'Subtotal'],
          ...products,
        ],
      },
    };

    const pdfDefinition: any = {
      content: [
        {
          text: establishment,
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: nit,
          fontSize: 12,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: title,
          fontSize: 14,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: `Fecha generacion: ${currentDate}`,
          fontSize: 12,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        table,
        {
          text: `Total: ${totalPrice}`,
          fontSize: 16,
          alignment: 'right',
          margin: [0, 20, 0, 10],
        },
      ],
    };

    pdfMake.createPdf(pdfDefinition).getBlob((blob: any) => {
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      URL.revokeObjectURL(url);
    });
  }

 /* showTotalInventory(productsTotal: ProductModel[]) {
    const title = `Total del inventario`;
    const establishment = 'Ferrecasa';
    const nit = 'NIT 91010777-8';
    const currentDate = formatDate(new Date(), 'yyyy/MM/dd HH:mm:ss', 'en-US');
    const totalPrice = this.formatCurrency(this.calculateTotalSale(sale.saleDetail));
    const products = sale.saleDetail.map((product: ProductModel) => {
      const subtotal = product.quantity * product.price_sale;
      return [
        product.id_product,
        product.name,
        product.presentation.name_presentation,
        product.quantity,
        this.formatCurrency(product.price_sale),
        this.formatCurrency(subtotal),
      ];
    });

    const table = {
      table: {
        headerRows: 1,
        widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
        body: [
          ['Id', 'Articulo', 'Presentacion', 'Cantidad', 'Valor', 'Subtotal'],
          ...products,
        ],
      },
    };

    const pdfDefinition: any = {
      content: [
        {
          text: establishment,
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: nit,
          fontSize: 12,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: title,
          fontSize: 14,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: `Fecha generacion: ${currentDate}`,
          fontSize: 12,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        table,
        {
          text: `Total: ${totalPrice}`,
          fontSize: 16,
          alignment: 'right',
          margin: [0, 20, 0, 10],
        },
      ],
    };

    pdfMake.createPdf(pdfDefinition).getBlob((blob: any) => {
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      URL.revokeObjectURL(url);
    });
  }
*/
  downloadPdfSale(sale: SaleModel) {
    const title = `Venta #${sale.id_sale}`;
    const establishment = 'Ferrecasa';
    const nit = 'NIT 91010777-8';
    const currentDate = formatDate(new Date(), 'yyyy/MM/dd HH:mm:ss', 'en-US');
    const totalPrice = this.formatCurrency(this.calculateTotalSale(sale.saleDetail));
    const totalPriceNumber = this.calculateTotalSale(sale.saleDetail);
    const products = sale.saleDetail.map((product: ProductModel) => {
      return [
        product.id_product,
        product.name,
        product.presentation.name_presentation,
        product.quantity,
        this.formatCurrency(product.price_sale),
      ];
    });

    const table = {
      table: {
        headerRows: 1,
        widths: ['auto', '*', 'auto', 'auto', 'auto'],
        body: [
          ['Id', 'Articulo', 'Presentacion', 'Cantidad', 'Valor'],
          ...products,
        ],
      },
    };

    const pdfDefinition: any = {
      content: [
        {
          text: establishment,
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: nit,
          fontSize: 12,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: title,
          fontSize: 14,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: `Fecha generacion: ${currentDate}`,
          fontSize: 12,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        table,
        {
          text: `Total: ${totalPrice}`,
          fontSize: 15,
          alignment: 'right',
          margin: [0, 20, 0, 10],
        },
        {
          text: `Valor pagado: ${this.formatCurrency(this.money)}`,
          fontSize: 15,
          alignment: 'right',
          margin: [0, 20, 0, 10],
        },
        {
          text: `Cambio: ${this.formatCurrency(this.money - totalPriceNumber)}`,
          fontSize: 14,
          alignment: 'right',
          margin: [0, 20, 0, 10],
        },
      ],
    };
    pdfMake.createPdf(pdfDefinition).getBlob((blob: any) => {
      const fileName = `Venta_${sale.id_sale}.pdf`;
      saveAs(blob, fileName);
    });
  }


  formatCurrency(amount: number): string {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }



  calculateTotalBuy(productsFact: ProductModel[]): number {
    let total: number = 0;
    for (let i = 0; i < productsFact.length; i++) {
      total += productsFact[i].quantity * productsFact[i].price_buy;
    }
    return total;
  }

  calculateTotalSale(productsFact: ProductModel[]): number {
    let total: number = 0;
    for (let i = 0; i < productsFact.length; i++) {
      total += productsFact[i].quantity * productsFact[i].price_sale;
    }
    return total;
  }
}
