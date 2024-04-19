import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  Observable,
  Subscription,
  distinctUntilChanged,
  interval,
  map,
} from 'rxjs';
import { ProductModel } from 'src/app/model/ProductModel';
import { SupplierModel } from 'src/app/model/SupplierModel';
import { AlertService } from 'src/app/service/alert.service';
import { ProductService } from 'src/app/service/product.service';
import { SupplierService } from 'src/app/service/supplier.service';
import {BuyModel} from "../../model/BuyModel";
import {BuyService} from "../../service/buy.service";

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
  formSupplier:FormGroup= new FormGroup({});
  filteredPro: ProductModel[] = [];
  productsFact: ProductModel[] = [];
  listSuppliers: SupplierModel[] = [];
  selectedSupplier: SupplierModel | undefined;
  private readonly AUTH_USERNAME = 'Desconocido';
  username: string | null = '';
  private subscription: Subscription;
  stockToAdd: number = 0;
  mensaje: string = '';
  uuid: string = ''; 

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
    this.username = localStorage.getItem(this.AUTH_USERNAME);
    this.listProducts();
    this.listSupplier();
    this.currentDate = new Date();
    this.formProduct = new FormGroup({
      name: new FormControl('', Validators.required),
      id_product: new FormControl('', Validators.required),
      stock: new FormControl('', Validators.required),
      price_buy: new FormControl('', Validators.required),
      price_sale: new FormControl('', Validators.required),
      id_supplier: new FormControl('', Validators.required),
      status: new FormControl('1')
    });
    this.formSupplier = new FormGroup({
      name: new FormControl(''),
      id_supplier: new FormControl(''),
      phone: new FormControl(''),
      email: new FormControl(''),
      status: new FormControl('')
    });
  }

  saveSupplier() {
    this.formSupplier.controls['status'].setValue('1');
    this.supplierService.saveSupplier(this.formSupplier.value).subscribe(resp=>{
      if(resp){
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
        const index = this.list.findIndex(item => item.id_product === this.selectedItem?.id_product);
        if (index !== -1) {
            this.list.splice(index, 1);
            this.selectedItem.stock = this.stockToAdd;
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

  save() {
    if (this.formProduct.valid) {
      this.mensaje = ''
      const supplierId = this.formProduct.controls['id_supplier'].value;
      const supplierName = ' ';
      const supplierPhone = ' ';
      const supplierEmail = ' ';

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
        status: 1,
      };
      this.producService.saveProduct(productData).subscribe((resp) => {
        if (resp) {
          this.console.log(resp);
          this.showAlert(resp.message, resp.seccess);
          this.listProducts();
          this.formProduct.reset();
        }
      });
    } else {
      this.mensaje = "Ingresa todos los campos correctamente";
    }
  }

  showAlert(message: string, okay: boolean) {
    this.alertService.showAlert(message, okay);
  }

  newSupplier(){
    this.formSupplier.reset();
  }

  newProduct() {
    this.formProduct.reset();
  }

  saveBuy(){
   if (this.selectedSupplier != null && this.uuid != ''){
    const buyData = {
      id_buy: this.uuid,
      id_supplier:this.selectedSupplier?.id_supplier,
      purchase_date:this.currentDate,
      total_price:0,
      buyDetail:this.productsFact
    };
    console.log(buyData);
    this.buyService.saveBuy(buyData).subscribe((resp) => {
      if (resp) {
        this.console.log(resp);
        this.showAlert(resp.message, resp.success);
        this.listProducts();
      }
    });
  }else {
    this.showAlert("Completa todos los campos requeridos", false);
  }
   }
  protected readonly console = console;
}
