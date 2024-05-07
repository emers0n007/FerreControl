import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import { saveAs } from 'file-saver';
import { BuyModel } from '../model/BuyModel';
import { ProductModel } from '../model/ProductModel';
import { formatDate } from '@angular/common';
import { BuyService } from './buy.service';
import { SaleModel } from '../model/SaleModel';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor(private buyService: BuyService) {}

  showPdfBuy(buy: BuyModel) {
    const title = `Compra #${buy.id_buy}`;
    const establishment = 'Ferrecasa';
    const nit = 'NIT 91010777-8';
    const currentDate = formatDate(new Date(), 'yyyy/MM/dd HH:mm:ss', 'en-US');
    const totalPrice = this.formatCurrency(this.calculateTotalBuy(buy.buyDetail));
    const products = buy.buyDetail.map((product: ProductModel) => {
      return [
        product.id_product,
        product.name,
        product.presentation.name_presentation,
        product.quantity,
        this.formatCurrency(product.price_buy),
      ];
    });

    const table = {
      table: {
        headerRows: 1,
        widths: ['auto', '*', 'auto', 'auto', 'auto'],
        body: [
          ['Id', 'Articulo', 'Presentacion', 'Cantidad', 'Precio de Compra'],
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
          alignment: 'center', // Alinea el texto al centro
          margin: [0, 0, 0, 10],
        },
        {
          text: nit,
          fontSize: 12,
          alignment: 'center', // Alinea el texto al centro
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
        }, // Centra la fecha
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
      return [
        product.id_product,
        product.name,
        product.presentation.name_presentation,
        product.quantity,
        this.formatCurrency(product.price_buy),
      ];
    });

    const table = {
      table: {
        headerRows: 1,
        widths: ['auto', '*', 'auto', 'auto', 'auto'],
        body: [
          ['Id', 'Articulo', 'Presentacion', 'Cantidad', 'Precio de Compra'],
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
          alignment: 'center', // Alinea el texto al centro
          margin: [0, 0, 0, 10],
        },
        {
          text: nit,
          fontSize: 12,
          alignment: 'center', // Alinea el texto al centro
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
        }, // Centra la fecha
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


  showPdfSale(sale: SaleModel) {
    const title = `Venta #${sale.id_sale}`;
    const establishment = 'Ferrecasa';
    const nit = 'NIT 91010777-8';
    const currentDate = formatDate(new Date(), 'yyyy/MM/dd HH:mm:ss', 'en-US');
    const totalPrice = this.formatCurrency(this.calculateTotalSale(sale.saleDetail));
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
          alignment: 'center', // Alinea el texto al centro
          margin: [0, 0, 0, 10],
        },
        {
          text: nit,
          fontSize: 12,
          alignment: 'center', // Alinea el texto al centro
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
        }, // Centra la fecha
        table,
        {
          text: `Total de la venta: ${totalPrice}`,
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

  downloadPdfSale(sale: SaleModel) {
    const title = `Venta #${sale.id_sale}`;
    const establishment = 'Ferrecasa';
    const nit = 'NIT 91010777-8';
    const currentDate = formatDate(new Date(), 'yyyy/MM/dd HH:mm:ss', 'en-US');
    const totalPrice = this.formatCurrency(this.calculateTotalSale(sale.saleDetail));
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
          alignment: 'center', // Alinea el texto al centro
          margin: [0, 0, 0, 10],
        },
        {
          text: nit,
          fontSize: 12,
          alignment: 'center', // Alinea el texto al centro
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
        }, // Centra la fecha
        table,
        {
          text: `Total de la venta: ${totalPrice}`,
          fontSize: 18,
          alignment: 'right',
          margin: [0, 30, 0, 10],
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
      console.log(productsFact[i].quantity, productsFact[i].price_sale);
      total += productsFact[i].quantity * productsFact[i].price_sale;
    }
    return total;
  }
}
