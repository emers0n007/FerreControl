import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import { saveAs } from 'file-saver';
import { BuyModel } from '../model/BuyModel';
import { ProductModel } from '../model/ProductModel';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  showPdfBuy(buy: BuyModel) {
    const title = `Compra #${buy.id_buy}`;
    const establishment = 'FerreCasa';
    const nit = 'NIT 91010777-8';
    const currentDate = formatDate(new Date(), 'dd/MM/yyyy', 'en-US');

    const products = buy.buyDetail.map((product: ProductModel) => {
      return [product.name, product.price_buy];
    });

    const table = {
      table: {
        headerRows: 1,
        widths: ['*', 'auto'],
        body: [['Producto', 'Precio de Compra'], ...products],
      },
    };

    const pdfDefinition: any = {
      content: [
      { text: establishment, fontSize: 14, bold: true, margin: [0, 0, 0, 10] },
      { text: nit, fontSize: 12, margin: [0, 0, 0, 10] },
      { text: title, fontSize: 16, bold: true, margin: [0, 0, 0, 10] },
      { text: `Fecha: ${currentDate}`, fontSize: 12, margin: [0, 0, 0, 10] },
        table,
      ],
    };

    pdfMake.createPdf(pdfDefinition).getBlob((blob: any) => {
      const url = URL.createObjectURL(blob);

      // Abrir el PDF en la misma ventana
      window.open(url, '_blank');

      // Liberar la URL de datos cuando ya no sea necesaria
      URL.revokeObjectURL(url);
    });
  }

  downloadPdfBuy(buy: BuyModel) {
    const title = `Compra #${buy.id_buy}`;

    const products = buy.buyDetail.map((product: ProductModel) => {
      return [product.name, product.price_buy];
    });

    const table = {
      table: {
        headerRows: 1,
        widths: ['*', 'auto'],
        body: [['Producto', 'Precio de Compra'], ...products],
      },
    };

    const pdfDefinition: any = {
      content: [
        { text: title, fontSize: 16, bold: true, margin: [0, 0, 0, 10] },
        table,
      ],
    };

    pdfMake.createPdf(pdfDefinition).getBlob((blob: any) => {
      const fileName = `Compra_${buy.id_buy}.pdf`;

      // Descargar el PDF con el nombre del archivo
      saveAs(blob, fileName);
    });
  }
}
