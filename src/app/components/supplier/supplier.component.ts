import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {SupplierModel} from "../../model/SupplierModel";
import {SupplierService} from "../../service/supplier.service";
import {Observable} from "rxjs";
import {distinctUntilChanged, map} from "rxjs/operators";

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements  OnInit{
  @ViewChild('toast') toast: any;
  list:SupplierModel[] = [];
  listComplet:SupplierModel[] = [];
  formSupplier:FormGroup= new FormGroup({});
  isUpdate:boolean = false;
  filteredSupplier: SupplierModel[] = [];

  constructor(private supplierService:SupplierService) {
  }

  ngOnInit(): void {
    this.listSupplier();
    this.formSupplier = new FormGroup({
      name: new FormControl(''),
      id_supplier: new FormControl(''),
      phone: new FormControl(''),
      email: new FormControl('')
    });
  }

  showToast() {
    this.toast.nativeElement.classList.add('show');
    setTimeout(() => {
      this.toast.nativeElement.classList.remove('show');
    }, 5000);
  }

  listSupplier(){
    this.supplierService.getSupplier().subscribe(resp=> {
      if (resp) {
        this.list = resp;
        this.listComplet = resp;
      }
    });
  }

  newProduct(){
    this.isUpdate = false;
    this.formSupplier.reset();
  }

  save() {
    this.formSupplier.controls['status'].setValue('1');
    this.supplierService.saveSupplier(this.formSupplier.value).subscribe(resp=>{
      if(resp){
        this.listSupplier();
        this.formSupplier.reset();
        this.showToast();
      }
    });
  }

  update(){
    this.supplierService.updateSupplier(this.formSupplier.value).subscribe(resp=>{
      if(resp){
        this.console.log(resp)
        this.listSupplier();
        this.formSupplier.reset();
      }
    });
  }

  delete(id: any){
    this.supplierService.deleteSupplier(id).subscribe(resp=>{
      if(resp){
        this.listSupplier();
      }
    });
  }
  selectItem(item:any){
    this.isUpdate = true;
    this.formSupplier.controls['name'].setValue(item.name);
    this.formSupplier.controls['id_supplier'].setValue(item.id_supplier);
    this.formSupplier.controls['phone'].setValue(item.phone);
    this.formSupplier.controls['email'].setValue(item.email);
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      distinctUntilChanged(),
      map(term => {
        const lowercaseTerm = term.toLowerCase();
        this.filteredSupplier = lowercaseTerm.length < 1 ? this.filteredSupplier = this.listComplet : this.listComplet.filter(product => {
          const includesTerm = product.name.toLowerCase().includes(lowercaseTerm);
          return includesTerm;
        });
        this.list = this.filteredSupplier;
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
