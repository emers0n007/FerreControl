import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../service/product.service";
import {ProductModel} from "../../model/ProductModel";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ViewChild } from '@angular/core';
import { AlertService } from 'src/app/service/alert.service';
import {SupplierModel} from "../../model/SupplierModel";
import {SupplierService} from "../../service/supplier.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{

  list:ProductModel[] = [];
  listSuppliers:SupplierModel[] = [];
  listComplet:ProductModel[] = [];
  formProduct:FormGroup= new FormGroup({});
  isUpdate:boolean = false;
  filteredProducts: ProductModel[] = [];
  selectedSupplierId: number = 0;

  constructor(private producService:ProductService, private alertService: AlertService, private supplierService:SupplierService) {
}
  ngOnInit(): void {
    this.listProducts();
    this.listSupplier();
    this.formProduct = new FormGroup({
      name: new FormControl(''),
      id_product: new FormControl('', Validators.required),
      stock: new FormControl(''),
      price_buy: new FormControl(''),
      price_sale: new FormControl(''),
      id_supplier: new FormControl(''),
      status: new FormControl('1')
    });
  }

  disableId(){
    this.formProduct.get('id_product')?.disable();
  }

  activeId(){
    this.formProduct.get('id_product')?.enable();
  }

  listProducts(){
    this.producService.getProducts().subscribe(resp=> {
      if (resp) {
        this.list = resp;
        this.listComplet = resp;
      }
    });
  }

  listSupplier(){
    this.supplierService.getSupplier().subscribe(resp=> {
      if (resp) {
        this.listSuppliers = resp;
      }
    });
  }

  newProduct(){
    this.isUpdate = false;
    this.activeId();
    this.formProduct.reset();
  }

  showAlert(message: string, okay: boolean){
    this.alertService.showAlert(message, okay);
  }

  save() {
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
        email: supplierEmail
      },
      status: 1
    };
    this.producService.saveProduct(productData).subscribe(resp=>{
      if(resp){
        this.console.log(resp);
        this.showAlert(resp.message, resp.seccess);
        this.listProducts();
        this.formProduct.reset();
      }
    });
  }

  update(){
    
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
        email: supplierEmail
      },
      status: 1
    };
    this.producService.updateProduct(productData).subscribe(resp=>{
      if(resp){
        this.console.log(resp);
        this.showAlert(resp.message, resp.seccess);
        this.listProducts();
        this.formProduct.reset();
      }
    });
  }

  delete(id: any){
    this.producService.deleteProduct(id).subscribe(resp=>{
      if(resp){
        this.listProducts();
      }
    });
  }
  selectItem(item:any){
    this.isUpdate = true;
    this.disableId();
    this.formProduct.controls['name'].setValue(item.name);
    this.formProduct.controls['id_product'].setValue(item.id_product);
    this.formProduct.controls['stock'].setValue(item.stock);
    this.formProduct.controls['price_buy'].setValue(item.price_buy);
    this.formProduct.controls['price_sale'].setValue(item.price_sale);
    this.formProduct.controls['id_supplier'].setValue(item.id_supplier);
    this.formProduct.controls['status'].setValue(item.status);

  }

  search = (text$: Observable<string>) =>
  text$.pipe(
    distinctUntilChanged(),
    map(term => {
      const lowercaseTerm = term.toLowerCase();
      this.filteredProducts = lowercaseTerm.length < 1 ? this.filteredProducts = this.listComplet : this.listComplet.filter(product => {
        const includesTerm = product.name.toLowerCase().includes(lowercaseTerm);
        return includesTerm;
      });
      this.list = this.filteredProducts;
      return [];
    })
  );

  protected readonly console = console;
}
