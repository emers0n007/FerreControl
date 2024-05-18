import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { SupplierModel } from '../../model/SupplierModel';
import { SupplierService } from '../../service/supplier.service';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { AlertService } from 'src/app/service/alert.service';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css'],
})
export class SupplierComponent implements OnInit {
  @ViewChild('toast') toast: any;
  list: SupplierModel[] = [];
  listComplet: SupplierModel[] = [];
  formSupplier: FormGroup = new FormGroup({});
  isUpdate: boolean = false;
  filteredSupplier: SupplierModel[] = [];
  @ViewChild('actu') modal: ElementRef | undefined;

  constructor(
    private supplierService: SupplierService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.listSupplier();
    this.formSupplier = new FormGroup({
      name: new FormControl('', Validators.required),
      id_supplier: new FormControl('', Validators.required),
      phone: new FormControl('', [Validators.required, this.phoneMaxLengthValidator, this.positiveNumberValidator]),
      email: new FormControl('', [Validators.required, Validators.email]),
      status: new FormControl(''),
    });
  }

  phoneMaxLengthValidator() {
    return (control: AbstractControl): ValidationErrors | null => {

      const value = control.value;
      this.console.log(control.value)
      if (value === null || value === undefined || value === '') {
        return null;
      }
      const isValid = value.toString().length <= 10; // Verifica si la longitud es menor o igual a 10
      return isValid ? null : { phoneMaxLength: true }; // Devuelve el error si la longitud es mayor a 10
    };
  }

  positiveNumberValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const isValid = !isNaN(value) && parseFloat(value) >= 0;
    return isValid ? null : { notPositiveNumber: true };
  }

  onSearchTextChanged(term: string) {
    this.filteredSupplier = term.length < 1 ? this.listComplet : this.listComplet.filter((product) =>
      product.name.toLowerCase().includes(term)
    );
    this.list = this.filteredSupplier;
  }

  disableId() {
    this.formSupplier.get('id_supplier')?.disable();
  }

  activeId() {
    this.formSupplier.get('id_supplier')?.enable();
  }

  listSupplier() {
    this.supplierService.getSupplier().subscribe((resp) => {
      if (resp) {
        this.list = resp;
        this.listComplet = resp;
      }
    });
  }

  showAlert(message: string, okay: boolean) {
    this.alertService.showAlert(message, okay);
  }

  newProduct() {
    this.isUpdate = false;
    this.activeId();
    this.formSupplier.reset();
  }

  isFormSubmitted: boolean = false;

  save() {
    const isFormValid = this.formSupplier.valid;
    this.isFormSubmitted = !isFormValid;
    if (this.formSupplier.valid) {
      this.console.log("HOLA");
      this.formSupplier.controls['status'].setValue('1');
      this.supplierService.saveSupplier(this.formSupplier.value)
        .subscribe((resp) => {
          if (resp) {
            this.showAlert(resp.message, resp.success);
            if(resp.success){
              this.closeModal();
              this.newProduct();
              this.formSupplier.reset();
            }
            this.listSupplier();
          }
        });

    }

  }

  update() {
     const isFormValid = this.formSupplier.valid;
    this.isFormSubmitted = !isFormValid;
    if(this.formSupplier.valid){
      const supplierData = {
        id_supplier: this.formSupplier.controls['id_supplier'].value,
        name: this.formSupplier.controls['name'].value,
        phone: this.formSupplier.controls['phone'].value,
        email: this.formSupplier.controls['email'].value,
        status: 1,
      };
      this.supplierService.updateSupplier(supplierData).subscribe((resp) => {
        if (resp) {
          this.showAlert(resp.message, resp.success);

          if(resp.success){
            this.closeModal();
            this.newProduct();
            this.formSupplier.reset();
          }
          this.listSupplier();

        }
      });
    }
  }

  delete(id: any) {
    this.supplierService.deleteSupplier(id).subscribe((resp) => {
      if (resp) {
        this.listSupplier();
      }
    });
  }
  selectItem(item: any) {
    this.isUpdate = true;
    this.formSupplier.controls['name'].setValue(item.name);
    this.formSupplier.controls['id_supplier'].setValue(item.id_supplier);
    this.formSupplier.controls['phone'].setValue(item.phone);
    this.formSupplier.controls['email'].setValue(item.email);
    this.disableId();
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      distinctUntilChanged(),
      map((term) => {
        const lowercaseTerm = term.toLowerCase();
        this.filteredSupplier =
          lowercaseTerm.length < 1
            ? (this.filteredSupplier = this.listComplet)
            : this.listComplet.filter((product) => {
                const includesTerm = product.name
                  .toLowerCase()
                  .includes(lowercaseTerm);
                return includesTerm;
              });
        this.list = this.filteredSupplier;
        return [];
      })
    );

    private closeModal() {
      if (this.modal) {
        const closeButton = this.modal.nativeElement.querySelector('[data-bs-dismiss="modal"]');
        if (closeButton) {
          closeButton.click();
        }
      }
    }

  protected readonly console = console;
}
