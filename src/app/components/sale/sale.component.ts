import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
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
  selectedItem: ProductModel;
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
  input: FormGroup = new FormGroup({});
  isFormSubmitted: boolean = false;
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

    this.listProducts();
    this.currentDate = new Date();
    this.generateUUID();

    this.input = new FormGroup({
      stockToAdd: new FormControl('', [Validators.required, this.positiveNumberValidator]),

    });
    this.username = localStorage.getItem(this.AUTH_USERNAME);
    this.console.log(localStorage.getItem(this.AUTH_USERNAME));
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  positiveNumberValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }


    const isValid = !isNaN(value) && parseFloat(value) >= 0;
    return isValid ? null : { notPositiveNumber: true };
  }

  valid: boolean = false;

  validNumberNegative(){
    if(this.stockToAdd !== null){
      if (this.stockToAdd < 0) {
        this.valid = false;
      }
    if (this.stockToAdd <= this.selectedItem.quantity) {
        this.valid = true;
    }
    }else {
      this.valid = false;
    }
  }


  generateUUID(){
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

    this.uuid = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
  }


  createUserAux(){
    const user={
      name_user:localStorage.getItem(this.AUTH_USER)
    }
    return user;
  }

  listProducts() {
    this.producService.getProducts(this.createUserAux().name_user).subscribe((resp) => {
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
    this.validNumberNegative();
    if (this.selectedItem && this.valid) {
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
      this.saleService.saveSale(saleData, this.createUserAux().name_user).subscribe((resp) => {
        if (resp) {
          this.showAlert(resp.message, resp.success);
          if (resp.success) {
            this.uuidCopy = this.uuid;
            this.generateUUID();
            this.openModal();
          }
          this.listProducts();
          this.productsFact = [];
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
    this.saleService.getSale(this.uuidCopy, this.createUserAux().name_user).subscribe(
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
