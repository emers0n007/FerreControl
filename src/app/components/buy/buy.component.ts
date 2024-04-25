import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
import { BuyModel } from '../../model/BuyModel';
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
  formProduct: FormGroup = new FormGroup({});
  listComplet: ProductModel[] = [];
  filteredProducts: ProductModel[] = [];
  formSupplier: FormGroup = new FormGroup({});
  filteredPro: ProductModel[] = [];
  productsFact: ProductModel[] = [];
  listSuppliers: SupplierModel[] = [];
  listMarks: MarkModel[] = [];
  selectedSupplier: SupplierModel | undefined;
  private readonly AUTH_USERNAME = 'Desconocido';
  private readonly AUTH_USER = 'No debe estar aqui';
  username: String | null = ' ';
  private subscription: Subscription;
  stockToAdd: number = 0;
  stockCount: number = 0;
  mensaje: string = '';
  uuid: string = '';

  selectedPresentation: string = '';
  presentationOptions = [
    { id: '1', label: 'Bulto', value: 'Bulto' },
    { id: '2', label: 'Caja', value: 'Caja' },
    { id: '3', label: 'Metro', value: 'Metro' },
  ];

  constructor(
    private producService: ProductService,
    private supplierService: SupplierService,
    private alertService: AlertService,
    private buyService: BuyService
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
    this.getListMarks();
    this.currentDate = new Date();
    this.formProduct = new FormGroup({
      name: new FormControl('', Validators.required),
      id_product: new FormControl('', Validators.required),
      stock: new FormControl('', Validators.required),
      price_buy: new FormControl('', Validators.required),
      price_sale: new FormControl('', Validators.required),
      id_supplier: new FormControl('', Validators.required),
      status: new FormControl('1'),
      presentation: new FormControl(''),
      description_presentation: new FormControl(''),
      id_mark: new FormControl(''),
      OtherMark: new FormControl(''),
      units: new FormControl('')
    });
    this.formSupplier = new FormGroup({
      name: new FormControl(''),
      id_supplier: new FormControl(''),
      phone: new FormControl(''),
      email: new FormControl(''),
      status: new FormControl(''),
    });
  }

  saveSupplier() {
    this.formSupplier.controls['status'].setValue('1');
    this.supplierService
      .saveSupplier(this.formSupplier.value)
      .subscribe((resp) => {
        if (resp) {
          this.showAlert(resp.message, resp.seccess);
          this.listSupplier();
          this.formSupplier.reset();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  listSupplier() {
    this.supplierService.getSupplier().subscribe((resp) => {
      if (resp) {
        this.listSuppliers = resp;
      }
    });
  }
  listProducts() {
    this.producService.getProducts().subscribe((resp) => {
      if (resp) {
        this.list = resp;
        this.listComplet = resp;
      }
    });
  }
  getListMarks() {
    this.producService.getMarks().subscribe((resp) => {
      if (resp) {
        this.listMarks = resp;
        const newMark = { id_mark: 9999, name_mark: 'Otro' };

        this.listMarks.push(newMark);
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

  addProduct() {
    if (this.selectedItem) {
      const index = this.list.findIndex(
        (item) => item.id_product === this.selectedItem?.id_product
      );
      if (index !== -1) {
        this.list.splice(index, 1);
        this.selectedItem.stock = this.stockCount;
        this.selectedItem.description_presentation = this.stockToAdd;
        this.productsFact.push(this.selectedItem);
      }
      this.selectedItem = undefined; // Restablece el valor
    }
  }

  addAll(item: any) {
    const index = this.productsFact.indexOf(item);
    if (index !== -1) {
      this.productsFact.splice(index, 1);
      const productToAdd = this.listComplet.find(
        (product) => product.id_product === item.id_product
      ); // Busca el producto en listComplet por su ID
      if (productToAdd) {
        this.list.push(productToAdd); // Agrega el producto a this.list
      }
    }
  }
   generateUniqueId(): string {
    // Obtener la marca de tiempo actual en milisegundos
    const timestamp = new Date().getTime();
  
    // Generar un número aleatorio entre 0 y 9999
    const randomNumber = Math.floor(Math.random() * 10000);
  
    // Concatenar la marca de tiempo y el número aleatorio para crear el ID único
    const uniqueId = timestamp.toString() + randomNumber.toString();
  
    return uniqueId;
  }
  

  save() {
    if (this.formProduct.valid) {
      this.mensaje = '';
      const supplierId =
        this.formProduct.controls['id_supplier'].value.id_supplier;
      const supplierName = ' ';
      const supplierPhone = ' ';
      const supplierEmail = ' ';

      const markControl = this.formProduct.controls['id_mark'];
      let markName: string;
      let markId: any;

      // Verificar si la marca es "Otro"
      if (markControl.value === 'Otro') {
        markName = this.formProduct.controls['OtherMark'].value;
        markId = this.generateUniqueId(); // Asume que tienes una función que genera IDs únicos
      } else {
        // Si no es "Otro", mantener los valores existentes
        markName = markControl.value.name_mark;
        markId = markControl.value.id_mark;
      }

      const productData = {
        id_product: this.formProduct.controls['id_product'].value,
        name: this.formProduct.controls['name'].value,
        stock: this.formProduct.controls['stock'].value,
        price_buy: this.formProduct.controls['price_buy'].value,
        price_sale: this.formProduct.controls['price_sale'].value,
        supplier: {
          id_supplier: supplierId,
          name: supplierName,
          phone: supplierPhone,
          email: supplierEmail,
        },
        presentation: this.formProduct.controls['presentation'].value,
        description_presentation:
          this.formProduct.controls['description_presentation'].value,
        mark: {
          id_mark: markId,
          name_mark: markName,
        },
        status: 1,
      };
      this.producService.saveProduct(productData).subscribe((resp) => {
        if (resp) {
          this.console.log(resp);
          this.showAlert(resp.message, resp.success);
          this.listProducts();
          this.formProduct.reset();
        }
      });
    } else {
      this.mensaje = 'Ingresa todos los campos correctamente';
    }
  }

  showAlert(message: string, okay: boolean) {
    this.alertService.showAlert(message, okay);
  }

  newSupplier() {
    this.formSupplier.reset();
  }

  newProduct() {
    this.formProduct.reset();
  }

  saveBuy() {
    if (this.selectedSupplier != null && this.uuid != '') {
      const buyData = {
        id_buy: this.uuid,
        id_supplier: this.selectedSupplier?.id_supplier,
        purchase_date: this.currentDate,
        total_price: 0,
        buyDetail: this.productsFact,
        name_user: localStorage.getItem(this.AUTH_USER),
      };
      console.log(buyData);
      this.buyService.saveBuy(buyData).subscribe((resp) => {
        if (resp) {
          this.console.log(resp);
          this.showAlert(resp.message, resp.success);
          this.listProducts();
        }
      });
    } else {
      this.showAlert('Completa todos los campos requeridos', false);
    }
  }

  selectedSupplierTwo: SupplierModel | undefined;

  searchSupplier = (text$: Observable<string>): Observable<SupplierModel[]> =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 1
          ? this.listSuppliers
          : this.listSuppliers
              .filter(
                (v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
    );

  formatSupplier = (supplier: SupplierModel) =>
    supplier.name ? supplier.name.toString() : '';

  onSupplierSelect(event: NgbTypeaheadSelectItemEvent) {
    this.selectedSupplier = event.item;
  }

  protected readonly console = console;

  selectedMark: MarkModel | undefined;

  searchMark = (text$: Observable<string>): Observable<MarkModel[]> =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? this.listMarks
          : this.listMarks
              .filter(
                (v) =>
                  v.name_mark.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
    );

  formatMark = (mark: MarkModel) =>
    mark.name_mark ? mark.name_mark.toString() : '';

  onMarkSelect(event: NgbTypeaheadSelectItemEvent) {
    this.selectedMark = event.item;
  }
}
