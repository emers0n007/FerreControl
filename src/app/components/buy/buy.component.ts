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
    this.currentDate = new Date();
   
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

  addProduct() {
    if (this.selectedItem) {
      const index = this.list.findIndex(
        (item) => item.id_product === this.selectedItem?.id_product
      );
      if (index !== -1) {
        this.list.splice(index, 1);
        this.selectedItem.stock = (this.stockToAdd*this.selectedItem.description_presentation) + this.stockCount;
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
  protected readonly console = console;

  
}
