import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SupplierModel } from 'src/app/model/SupplierModel';
import { AlertService } from 'src/app/service/alert.service';
import { SupplierService } from 'src/app/service/supplier.service';

@Component({
  selector: 'app-modal-new-supplier',
  templateUrl: './modal-new-supplier.component.html',
  styleUrls: ['./modal-new-supplier.component.css']
})
export class ModalNewSupplierComponent implements OnInit{

  formSupplier: FormGroup = new FormGroup({});
  listSuppliers: SupplierModel[] = [];
  
  constructor( private supplierService: SupplierService, private alertService: AlertService){

  }

  ngOnInit(): void {
    
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

  newSupplier() {
    this.formSupplier.reset();
  }
}
