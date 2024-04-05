import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../service/product.service";
import {ProductModel} from "../../model/ProductModel";
import {FormControl, FormGroup} from "@angular/forms";
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ViewChild } from '@angular/core';
import { AlertService } from 'src/app/service/alert.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{
  @ViewChild('toast') toast: any;
  list:ProductModel[] = [];
  listComplet:ProductModel[] = [];
  formProduct:FormGroup= new FormGroup({});
  isUpdate:boolean = false;
  filteredProducts: ProductModel[] = [];
  notificationSuccess: boolean = false;
  notificationMessage: string = '';

  constructor(private producService:ProductService, private alertService: AlertService) {
}
  ngOnInit(): void {
    this.listProducts();
    this.formProduct = new FormGroup({
      name: new FormControl(''),
      id_product: new FormControl(''),
      stock: new FormControl(''),
      price_buy: new FormControl(''),
      price_sale: new FormControl(''),
      id_supplier: new FormControl(''),
      status: new FormControl('1')
    });
  }

  listProducts(){
    this.producService.getProducts().subscribe(resp=> {
      if (resp) {
        this.list = resp;
        this.listComplet = resp;
      }
    });
  }

  newProduct(){
    this.isUpdate = false;
    this.formProduct.reset();
  }

  showAlert(message: string, okay: boolean){
    this.alertService.showAlert(message, okay);
  }
  
  save() {
    this.formProduct.controls['status'].setValue('1');
    this.producService.saveProduct(this.formProduct.value).subscribe(resp=>{
      if(resp){
        this.console.log(resp);
        this.showAlert(resp.message, resp.seccess);
        this.listProducts();
        this.formProduct.reset();
      }
    });
  }

  update(){
    this.producService.updateProduct(this.formProduct.value).subscribe(resp=>{
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

  //formatProduct = (product: ProductModel) => product.name.toString();

  // Método para manejar la selección de producto
  /*onProductSelect(selectedProduct: ProductModel) {
    console.log('Producto seleccionado:', selectedProduct);
    // Aquí puedes realizar acciones adicionales cuando se selecciona un producto
  }*/

  protected readonly console = console;
}
