import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../service/product.service";
import {ProductModel} from "../../model/ProductModel";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{

  list:ProductModel[] = [];
  formProduct:FormGroup= new FormGroup({});
  isUpdate:boolean = false;
  constructor(private producService:ProductService) {
}
  ngOnInit(): void {
    this.listProducts();
    this.formProduct = new FormGroup({
      name: new FormControl(''),
      id: new FormControl(''),
      quantity: new FormControl(''),
      price: new FormControl(''),
      status: new FormControl('1')
    });
  }

  listProducts(){
    this.producService.getProducts().subscribe(resp=> {
      if (resp) {
        this.list = resp;
      }
    });
  }

  newProduct(){
    this.isUpdate = false;
    this.formProduct.reset();
  }

  save() {
    this.formProduct.controls['status'].setValue('1');
    this.producService.saveProduct(this.formProduct.value).subscribe(resp=>{

      if(resp){
        this.listProducts();
        this.formProduct.reset();

      }
    });
  }

  update(){
    this.producService.updateProduct(this.formProduct.value).subscribe(resp=>{
      if(resp){
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
    this.formProduct.controls['id'].setValue(item.id);
    this.formProduct.controls['quantity'].setValue(item.quantity);
    this.formProduct.controls['price'].setValue(item.price);
  }

  protected readonly console = console;
}
