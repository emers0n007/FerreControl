import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SupplierModel} from "../../model/SupplierModel";
import {SupplierService} from "../../service/supplier.service";
import {Observable} from "rxjs";
import {distinctUntilChanged, map} from "rxjs/operators";
import { AlertService } from 'src/app/service/alert.service';

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

  constructor(private supplierService:SupplierService, private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.listSupplier();
    this.formSupplier = new FormGroup({
      name: new FormControl(''),
      id_supplier: new FormControl('', Validators.required),
      phone: new FormControl(''),
      email: new FormControl(''),
      status: new FormControl('')
    });
  }

  disableId(){
    this.formSupplier.get('id_supplier')?.disable();
  }

  activeId(){
    this.formSupplier.get('id_supplier')?.enable();
  }

  listSupplier(){
    this.supplierService.getSupplier().subscribe(resp=> {
      if (resp) {
        this.list = resp;
        this.listComplet = resp;
      }
    });
  }

  showAlert(message: string, okay: boolean){
    this.alertService.showAlert(message, okay);
  }

  newProduct(){
    this.isUpdate = false;
    this.activeId();
    this.formSupplier.reset();
  }

  save() {
    this.formSupplier.controls['status'].setValue('1');
    this.supplierService.saveSupplier(this.formSupplier.value).subscribe(resp=>{
      if(resp){
        this.showAlert(resp.message, resp.success);
        this.listSupplier();
        this.formSupplier.reset();
      }
    });
  }

  update(){
    const supplierData = {
      id_supplier: this.formSupplier.controls['id_supplier'].value,
      name: this.formSupplier.controls['name'].value,
      phone: this.formSupplier.controls['phone'].value,
      email: this.formSupplier.controls['email'].value,
      status:1
    }
    this.supplierService.updateSupplier(supplierData).subscribe(resp=>{
      if(resp){
        this.showAlert(resp.message, resp.success);
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
    //this.disableId();
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

  protected readonly console = console;
}
