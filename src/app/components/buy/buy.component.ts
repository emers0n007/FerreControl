import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import {
  Observable,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  interval,
  map,
} from 'rxjs';
import { ProductModel } from 'src/app/model/ProductModel';
import { SupplierModel } from 'src/app/model/SupplierModel';
import { AlertService } from 'src/app/service/alert.service';
import { ProductService } from 'src/app/service/product.service';
import { SupplierService } from 'src/app/service/supplier.service';
import { BuyService } from '../../service/buy.service';
import { MarkModel } from 'src/app/model/MarkModel';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';





@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css'],
})
export class BuyComponent implements OnInit, OnDestroy {
  currentDate: Date = new Date();
  selectedItem: ProductModel | undefined;
  list: ProductModel[] = [];

  listComplet: ProductModel[] = [];
  filteredProducts: ProductModel[] = [];

  filteredPro: ProductModel[] = [];
  productsFact: ProductModel[] = [];
  listSuppliers: SupplierModel[] = [];
  selectedSupplier: SupplierModel | undefined;
  private readonly AUTH_USERNAME = 'Desconocido';
  private readonly AUTH_USER = 'No debe estar aqui';
  username: String | null = ' ';
  private subscription: Subscription;
  stockToAdd: number = 0;
  stockCount: number = 0;
  uuid: string = '';


  formProduct: FormGroup = new FormGroup({});
  selectedPresentation: string = '';
  listMarks: MarkModel[] = [];
  presentationOptions = [
    { id: '1', label: 'Bulto', value: 'Bulto' },
    { id: '2', label: 'Caja', value: 'Caja' },
    { id: '3', label: 'Metro', value: 'Metro' },
  ];

  // Modal Supplier //
  formSupplier: FormGroup = new FormGroup({});

  formBuy: FormGroup = new FormGroup({});
  constructor(
    private producService: ProductService,
    private buyService: BuyService,
    private alertService: AlertService,
    private supplierService: SupplierService
  ) {
    this.subscription = interval(1000).subscribe(() => {
      this.currentDate = new Date();
    });
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.showAlert("Selecciona el proveedor para agregar productos", false);
    }, 0);
    this.username = localStorage.getItem(this.AUTH_USERNAME);
    this.listProducts();
    this.listSupplier();
    this.listSupplier();
    this.getListMarks();
    this.formProduct = new FormGroup({
      name: new FormControl('', Validators.required),
      id_product: new FormControl('', Validators.required),
      stock: new FormControl('', Validators.required),
      price_buy: new FormControl('', [Validators.required, this.positiveNumberValidator]),
      price_sale: new FormControl('', [Validators.required, this.positiveNumberValidator]),
      id_supplier: new FormControl('', Validators.required),
      status: new FormControl('1'),
      presentation: new FormControl('', Validators.required),
      description_presentation: new FormControl('', Validators.required),
      id_mark: new FormControl(''),
      OtherMark: new FormControl(''),
      units: new FormControl('')
    });
    this.formSupplier = new FormGroup({
      name: new FormControl('', Validators.required),
      id_supplier: new FormControl('', Validators.required),
      phone: new FormControl('', [Validators.required, this.phoneMaxLengthValidator.bind(this), this.positiveNumberValidator]),
      email: new FormControl('', [Validators.required, Validators.email]),
      status: new FormControl(''),
    });
    this.formBuy = new FormGroup({

      stockToAdd: new FormControl('', [Validators.required,  this.positiveNumberValidator]),
      stockCount: new FormControl('', [Validators.required,  this.positiveNumberValidator]),
    });
    this.currentDate = new Date();

  }

  phoneMaxLengthValidator(control: AbstractControl) :
    ValidationErrors | null {
      const value = control.value;
      if (value === null || value === undefined || value === '') {
        return null;
      }
      const isValid = value.toString().length <= 10;
      return isValid ? null : { phoneMaxLength: true };
  }

  listSupplier() {
    this.supplierService.getSupplier().subscribe((resp) => {
      if (resp) {
        this.listSuppliers = resp;
      }
    });
  }

  showAlert(message: string, okay: boolean) {
    this.alertService.showAlert(message, okay);
  }


  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  listProducts() {
    this.producService.getProducts().subscribe((resp) => {
      if (resp) {
        this.list = resp;
        this.listComplet = resp;
      }
    });
  }


  onSupplierSelected(event: Event) {
    const selectedSupplierId = (event.target as HTMLSelectElement).value;
    const selectedSupplier = this.listSuppliers.find(
      (supplier) => supplier.id_supplier === parseInt(selectedSupplierId, 10)
    );
    this.selectedSupplier = selectedSupplier;
    if (selectedSupplier) {
      const filteredProducts = this.listComplet.filter(
        (product) => product.supplier.name === selectedSupplier.name
      );
      this.filteredPro = filteredProducts;
      this.list = this.filteredPro;
    }
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      distinctUntilChanged(),
      map((term) => {
        const lowercaseTerm = term.toLowerCase();
        this.filteredProducts =
          lowercaseTerm.length < 1
            ? (this.filteredProducts = this.filteredPro)
            : this.filteredPro.filter((product) => {
                const includesTerm = product.name
                  .toLowerCase()
                  .includes(lowercaseTerm);
                return includesTerm;
              });
        this.list = this.filteredProducts;
        return [];
      })
    );

  selectItem(item: any) {
    this.selectedItem = Object.assign({}, item);
  }

  isFormSubmitted: boolean = false;


  addProduct() {
    const isFormValid = this.formBuy.valid;
    this.isFormSubmitted = !isFormValid;
    if(isFormValid){
      if (this.selectedItem) {
        const index = this.list.findIndex(
          (item) => item.id_product === this.selectedItem?.id_product
        );
        if (index !== -1) {
          this.list.splice(index, 1);
          this.selectedItem.quantity = (this.stockToAdd*this.selectedItem.presentation.description_presentation) + this.stockCount;
          this.productsFact.push(this.selectedItem);
        }
        this.selectedItem = undefined;
      }
    }
    this.stockToAdd = 0;
    this.stockCount = 0;
  }

  addAll(item: any) {
    const index = this.productsFact.indexOf(item);
    if (index !== -1) {
      this.productsFact.splice(index, 1);
      const productToAdd = this.listComplet.find(
        (product) => product.id_product === item.id_product
      );
      if (productToAdd) {
        this.list.push(productToAdd);
      }
    }
  }

  saveBuy() {
    if (this.selectedSupplier != null && this.uuid != '') {
      const buyData = {
        id_buy: this.uuid,
        id_supplier: this.selectedSupplier?.id_supplier,
        purchase_date: this.currentDate,
        total_price: this.calculateTotal(this.productsFact),
        buyDetail: this.productsFact,
        name_user: localStorage.getItem(this.AUTH_USER),
      };
      console.log(buyData);
      this.buyService.saveBuy(buyData).subscribe((resp) => {
        if (resp) {
          this.console.log(resp);
          this.showAlert(resp.message, resp.seccess);
          this.listProducts();
          this.productsFact = [];
          this.uuid = '';
        }
      });
    } else {
      this.showAlert('Completa todos los campos requeridos', false);
    }
  }


  invalidSupplier: boolean = false;
  isFormSubmittedProduct: boolean = false;
  invalidMark: boolean = false;
  @ViewChild('product') modalProduct: ElementRef | undefined;


  private closeModalProduct() {
    if (this.modalProduct) {
      const closeButton = this.modalProduct.nativeElement.querySelector(
        '[data-bs-dismiss="modal"]'
      );
      if (closeButton) {
        closeButton.click();
      }
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


  save() {
    const isFormValid = this.formProduct.valid;
    this.isFormSubmittedProduct = !isFormValid;
    if (this.formProduct.valid) {
      const supplierId = this.formProduct.controls['id_supplier'].value.id_supplier;
      const supplierName = ' ';
      const supplierPhone = ' ';
      const supplierEmail = ' ';

      const markControl = this.formProduct.controls['id_mark'];
      let markName: string;
      let markId: any;

      if (markControl.value.name_mark === 'Otro') {
        markName = this.formProduct.controls['OtherMark'].value;
        this.console.log("SI INGRESAAA", markName)
        markId = 0;
      } else {
        markName = markControl.value.name_mark;
        markId = markControl.value.id_mark;
      }


      const productData = {
        id_product: '770' + this.formProduct.controls['id_product'].value,
        name: this.formProduct.controls['name'].value,
        stock: this.formProduct.controls['stock'].value,
        price_buy: this.formProduct.controls['price_buy'].value,
        price_sale: this.formProduct.controls['price_sale'].value,
        quantity: 0,
        supplier: {
          id_supplier: supplierId,
          name: supplierName,
          phone: supplierPhone,
          email: supplierEmail,
        },
        presentation: {
          id_presentation: 0,
          name_presentation :this.formProduct.controls['presentation'].value,
          description_presentation:this.formProduct.controls['description_presentation'].value},
        mark: {
          id_mark: markId,
          name_mark: markName,
        },
        status: 1,
      };

      console.log("PRESENTACION", this.formProduct.controls['presentation'].value);
      const mark = {
        id_mark: markId,
        name_mark: markName,
      }


        this.producService.saveProduct(productData).subscribe((resp) => {
          if (resp) {
            this.showAlert(resp.message, resp.success);
            if(resp.success){
              this.getListMarks();
              this.formProduct.reset();
            }
            this.listProducts();
          }
        });
      this.closeModalProduct();
    }
  }


  selectedSupplierTwo: SupplierModel | undefined;

  searchSupplier = (text$: Observable<string>): Observable<SupplierModel[]> =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) => {
        if (term != '') {
          const foundSupplier = this.listSuppliers.find(
            (supplier) => supplier.name.toLowerCase() === term.toLowerCase()
          );
          this.invalidSupplier = !foundSupplier;
        } else {
          this.invalidSupplier = false;
        }
        return term.length < 2
          ? this.listSuppliers
          : this.listSuppliers
              .filter(
                (v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10);
      }
      )
    );

    formatSupplier = (supplier: SupplierModel) =>
      supplier.name ? supplier.name.toString() : '';

    onSupplierSelect(event: NgbTypeaheadSelectItemEvent) {
      this.selectedSupplier = event.item;

      const foundSupplier = this.listSuppliers.find(
        (supplier) => supplier.id_supplier === this.selectedSupplier?.id_supplier
      );
      if (!foundSupplier) {
        this.invalidSupplier = true;
      } else {
        this.invalidSupplier = false;
      }
    }


    getListMarks() {
      this.producService.getMarks().subscribe((resp) => {
        if (resp) {
          this.listMarks = resp;
          const newMark = { id_mark: 0, name_mark: 'Otro' };

          this.listMarks.push(newMark);
        }
      });
    }

    selectedMark: MarkModel | undefined;

    searchMark = (text$: Observable<string>): Observable<MarkModel[]> =>
      text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        map((term) =>{
          if (term != '') {
            const foundSupplier = this.listMarks.find(
              (mark) => mark.name_mark.toLowerCase() === term.toLowerCase()
            );
            this.invalidMark = !foundSupplier;
          } else {
            this.invalidMark = false;
          }

          return term.length < 2
            ? this.listMarks
            : this.listMarks
                .filter(
                  (v) =>
                    v.name_mark.toLowerCase().indexOf(term.toLowerCase()) > -1
                )
                .slice(0, 10);
        }
        )
      );

    formatMark = (mark: MarkModel) =>
      mark.name_mark ? mark.name_mark.toString() : '';

    onMarkSelect(event: NgbTypeaheadSelectItemEvent) {
      this.selectedMark = event.item;
      const foundSupplier = this.listMarks.find(
        (mark) => mark.id_mark === this.selectedMark?.id_mark
      );
      if (!foundSupplier) {
        this.invalidMark = true;
      } else {
        this.invalidMark = false;
      }
    }

  newProduct() {
    this.formProduct.reset();
  }

  isFormSubmittedSupplier: boolean = false;
  @ViewChild('supplier') modal: ElementRef | undefined;

  saveSupplier() {
    const isFormValid = this.formSupplier.valid;
    this.isFormSubmittedSupplier = !isFormValid;
    if (this.formSupplier.valid) {
      this.formSupplier.controls['status'].setValue('1');
      this.supplierService.saveSupplier(this.formSupplier.value)
        .subscribe((resp) => {

          if (resp) {
            this.showAlert(resp.message, resp.seccess);
            this.listSupplier();
            this.formSupplier.reset();
          }
        });
      this.closeModalSupplier();
    }
  }

  private closeModalSupplier() {
    if (this.modal) {
      const closeButton = this.modal.nativeElement.querySelector('[data-bs-dismiss="modal"]');
      if (closeButton) {
        closeButton.click();
      }
    }
  }

  newSupplier() {
    this.formSupplier.reset();
  }

  calculateTotal(productsFact: ProductModel[]): number {
    let total: number = 0;
    for (let i = 0; i < productsFact.length; i++) {
      total += productsFact[i].quantity * productsFact[i].price_buy;
    }
    return total;
  }

  subTotal(product: ProductModel): number {
    return product.price_buy*product.quantity;
  }


  protected readonly console = console;


}
