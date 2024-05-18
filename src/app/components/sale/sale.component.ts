import { Component } from '@angular/core';
import {
  Observable,
  Subscription,
  distinctUntilChanged,
  interval,
  map,
} from 'rxjs';
import { ProductModel } from 'src/app/model/ProductModel';
import { SaleModel } from 'src/app/model/SaleModel';
import { AlertService } from 'src/app/service/alert.service';
import { PdfService } from 'src/app/service/pdf.service';
import { ProductService } from 'src/app/service/product.service';
import { SaleService } from 'src/app/service/sale.service';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css'],
})
export class SaleComponent {
  currentDate: Date = new Date();
  selectedItem: ProductModel | undefined;
  list: ProductModel[] = [];
  listComplet: ProductModel[] = [];
  filteredPro: ProductModel[] = [];
  productsFact: ProductModel[] = [];
  private readonly AUTH_USERNAME = 'Desconocido';
  private readonly AUTH_USER = 'No debe estar aqui';
  username: string | null = '';
  private subscription: Subscription;
  stockToAdd: number = 0;
  mensaje: string = '';
  uuid: string = '';
  uuidCopy: string = '';

  clientName: string = '';
  document: number = 0;
  money: number = 0;
  total: number = 0;

  constructor(
    private producService: ProductService,
    private alertService: AlertService,
    private saleService: SaleService,
    private pdfService: PdfService
  ) {
    this.subscription = interval(1000).subscribe(() => {
      this.currentDate = new Date();
    });
  }
  ngOnInit(): void {
    this.username = localStorage.getItem(this.AUTH_USERNAME);
    this.listProducts();
    this.currentDate = new Date();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  listProducts() {
    this.producService.getProducts().subscribe((resp) => {
      if (resp) {
        this.list = [...resp];
        this.listComplet = [...resp];
      }
    });
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      distinctUntilChanged(),
      map((term) => {
        const lowercaseTerm = term.toLowerCase();
        this.filteredPro =
          lowercaseTerm.length < 1
            ? this.listComplet
            : this.listComplet.filter((product) => {
                const includesTerm = product.name
                  .toLowerCase()
                  .includes(lowercaseTerm);
                return includesTerm;
              });
        this.list = this.filteredPro;
        return [];
      })
    );

  selectItem(item: any) {
    this.selectedItem = Object.assign({}, item);
  }

  addProduct() {
    if (this.selectedItem) {
      const index = this.list.findIndex(
        (item) => item.id_product === this.selectedItem?.id_product
      );
      if (index !== -1) {
        this.list.splice(index, 1);
        this.selectedItem.quantity = this.stockToAdd;
        this.productsFact.push(this.selectedItem);
      }
      this.selectedItem = undefined;
    }
  }

  addAll(item: any) {
    const index = this.productsFact.indexOf(item);
    if (index !== -1) {
      this.productsFact.splice(index, 1);
      const productToAdd = this.listComplet.find((product) => {
        return product.id_product === item.id_product;
      });
      if (productToAdd) {
        this.list.push(productToAdd);
      }
    }
  }

  showAlert(message: string, okay: boolean) {
    this.alertService.showAlert(message, okay);
  }

  saveSale() {
    if (this.uuid != '') {
      const saleData = {
        id_sale: this.uuid,
        sale_date: this.currentDate,
        total_price: this.calculateTotal(this.productsFact),
        saleDetail: this.productsFact,
        name_user: localStorage.getItem(this.AUTH_USER),
      };
      this.saleService.saveSupplier(saleData).subscribe((resp) => {
        if (resp) {
          this.showAlert(resp.message, resp.success);
          if (resp.success) {
            this.uuidCopy = this.uuid;
            this.openModal();
          }
          this.listProducts();
          this.productsFact = [];
          this.uuid = '';
        }
      });
    } else {
      this.showAlert('Completa todos los campos requeridos', false);
    }
  }

  calculateTotal(productsFact: ProductModel[]): number {
    let total: number = 0;
    for (let i = 0; i < productsFact.length; i++) {
      total += productsFact[i].quantity * productsFact[i].price_sale;
    }
    return total;
  }

  subTotal(product: ProductModel): number {
    return product.price_sale * product.quantity;
  }

  viewPdfClicked() {
    if(this.clientName === ""){
      this.clientName = " Cliente Generico"
    }
    if(this.document == 0){
      this.document = 7777777;
    }
    this.pdfService.setValues(this.clientName, this.document, this.money);
    this.pdfService.showPdfSaleComponent(this.sale);
  }

  sale: SaleModel;

  openModal() {
    this.saleService.getSale(this.uuidCopy).subscribe(
      (sale: SaleModel) => {
        this.sale = sale;
        this.total = this.sale.total_price;
      },
      error => {
        console.error('Error fetching sale:', error);
      }
    );
    const modal = document.getElementById('clientInfoModal');
    if (modal) {
      modal.classList.remove('modal-fade');
      modal.setAttribute('aria-hidden', 'false');
      modal.style.display = 'block';
    }
  }

  closeModal() {
    this.uuidCopy = "";
    const modal = document.getElementById('clientInfoModal');
    if (modal) {
      modal.classList.add('modal-fade');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
    }
  }

  protected readonly console = console;
}
