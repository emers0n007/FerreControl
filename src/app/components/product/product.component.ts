import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { ProductModel } from '../../model/ProductModel';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { AlertService } from 'src/app/service/alert.service';
import { SupplierModel } from '../../model/SupplierModel';
import { SupplierService } from '../../service/supplier.service';
import { MarkModel } from '../../model/MarkModel';
import { Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { ModalProductsLowService } from 'src/app/service/modal-products-low.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  list: ProductModel[] = [];
  listSuppliers: SupplierModel[] = [];
  listComplet: ProductModel[] = [];
  listMarks: MarkModel[] = [];
  formProduct: FormGroup = new FormGroup({});
  isUpdate: boolean = false;
  filteredProducts: ProductModel[] = [];
  selectedSupplierId: number = 0;

  // validated form
  isFormSubmitted: boolean = false;
  @ViewChild('actu') modal: ElementRef | undefined;

  selectedPresentation: string = '';

  presentationOptions = [
    { id: '1', label: 'Bulto', value: 'Bulto' },
    { id: '2', label: 'Caja', value: 'Caja' },
    { id: '3', label: 'Metro', value: 'Metro' },
  ];

  constructor(
    private producService: ProductService,
    private alertService: AlertService,
    private supplierService: SupplierService,
    private modalProduct: ModalProductsLowService
  ) {}

  ngOnInit(): void {
    this.listProducts();
    this.listSupplier();
    this.getListMarks();
    this.formProduct = new FormGroup({
      name: new FormControl('', [Validators.required]),
      id_product: new FormControl('', Validators.required),
      stock: new FormControl('', Validators.required),
      price_buy: new FormControl('', [
        Validators.required,
        this.positiveNumberValidator,
      ]),
      price_sale: new FormControl('', [
        Validators.required,
        this.positiveNumberValidator,
      ]),
      id_supplier: new FormControl('', Validators.required),
      status: new FormControl('1'),
      presentation: new FormControl('', Validators.required),
      description_presentation: new FormControl('', Validators.required),
      id_mark: new FormControl(''),
    });
  }

  onSearchTextChanged(term: string) {
    this.filteredProducts =
      term.length < 1
        ? this.listComplet
        : this.listComplet.filter((product) =>
            product.name.toLowerCase().includes(term)
          );
    this.list = this.filteredProducts;
  }

  disableId() {
    this.formProduct.get('id_product')?.disable();
    this.formProduct.get('stock')?.disable();
    this.formProduct.get('description_presentation')?.disable();
  }

  activeId() {
    this.formProduct.get('id_product')?.enable();
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

  newProduct() {
    this.isUpdate = false;
    this.activeId();
    this.resetFormatProduct();
  }

  resetFormatProduct(){
    this.formProduct.reset();
  }

  showAlert(message: string, okay: boolean) {
    this.alertService.showAlert(message, okay);
  }

  update() {
    const isFormValid = this.formProduct.valid;
    this.isFormSubmitted = !isFormValid;
    if (isFormValid && !this.invalidSupplier) {
      const supplierId =
        this.formProduct.controls['id_supplier'].value.id_supplier;
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
        presentation: {
          id_presentation: 0,
          name_presentation:this.formProduct.controls['presentation'].value,
          description_presentation:this.formProduct.controls['description_presentation'].value},
        mark: {
          id_mark: this.formProduct.controls['id_mark'].value.id_mark,
          name_mark: this.formProduct.controls['id_mark'].value.name_mark,
        },
        status: 1,
      };
      console.log(productData);
      this.producService.updateProduct(productData).subscribe((resp) => {
        if (resp) {
          this.showAlert(resp.message, resp.seccess);
          this.listProducts();
          this.formProduct.reset();
          this.closeModal();
        }
      });
    }
    this.closeModal();
  }

  delete(id: any) {
    this.producService.deleteProduct(id).subscribe((resp) => {
      if (resp) {
        this.listProducts();
      }
    });
  }
  selectItem(item: any) {
    this.isUpdate = true;
    this.disableId();
    this.console.log(item);
    this.formProduct.controls['name'].setValue(item.name);
    this.formProduct.controls['id_product'].setValue(item.id_product);
    this.formProduct.controls['stock'].setValue(item.stock);
    this.formProduct.controls['price_buy'].setValue(item.price_buy);
    this.formProduct.controls['price_sale'].setValue(item.price_sale);
    this.formProduct.controls['id_supplier'].setValue(
      item.supplier.id_supplier
    );
    this.selectedSupplier = item.supplier;
    this.formProduct.controls['status'].setValue(item.status);
    this.formProduct.controls['id_mark'].setValue(item.mark.id_mark);
    this.selectedMark = item.mark;
    this.formProduct.controls['presentation'].setValue(item.presentation);
    this.selectedPresentation = item.presentation.name_presentation;
    this.formProduct.controls['description_presentation'].setValue(
      item.presentation.description_presentation
    );
  }

  selectedSupplier: SupplierModel | undefined;
  search = (text$: Observable<string>): Observable<SupplierModel[]> =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) => {
        if (term != '') {
          const foundSupplier = this.listSuppliers.find(
            (supplier) => supplier.name.toLowerCase() === term.toLowerCase()
          );
          this.invalidSupplier = !foundSupplier;
        } else {
          this.invalidSupplier = false;
        }
        return term.length < 1
          ? this.listSuppliers
          : this.listSuppliers
              .filter(
                (v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10);
      })
    );

  formatSupplier = (supplier: SupplierModel) =>
    supplier.name ? supplier.name.toString() : '';

  invalidSupplier: boolean = false;

  onSupplierSelect(event: NgbTypeaheadSelectItemEvent) {
    this.selectedSupplier = event.item;
    const foundSupplier = this.listSuppliers.find(
      (supplier) => supplier.id_supplier === this.selectedSupplier?.id_supplier
    );
    if (!foundSupplier) {
      this.invalidSupplier = true;
    } else {
      this.invalidSupplier = false;
    }
  }

  protected readonly console = console;

  selectedMark: MarkModel | undefined;

  invalidMark: boolean = false;

  searchMark = (text$: Observable<string>): Observable<MarkModel[]> =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) => {
        if (term != '') {
          const foundSupplier = this.listMarks.find(
            (mark) => mark.name_mark.toLowerCase() === term.toLowerCase()
          );
          this.invalidMark = !foundSupplier;
        } else {
          this.invalidMark = false;
        }

        return term.length < 1
          ? this.listMarks
          : this.listMarks
              .filter(
                (v) =>
                  v.name_mark.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10);
      })
    );

  formatMark = (mark: MarkModel) =>
    mark.name_mark ? mark.name_mark.toString() : '';

  onMarkSelect(event: NgbTypeaheadSelectItemEvent) {
    this.selectedMark = event.item;

    const foundSupplier = this.listMarks.find(
      (mark) => mark.id_mark === this.selectedMark?.id_mark
    );
    if (!foundSupplier) {
      this.invalidMark = true;
    } else {
      this.invalidMark = false;
    }
  }

  positiveNumberValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const isValid = !isNaN(value) && parseFloat(value) >= 0;
    return isValid ? null : { notPositiveNumber: true };
  }

  private closeModal() {
    if (this.modal) {
      const closeButton = this.modal.nativeElement.querySelector(
        '[data-bs-dismiss="modal"]'
      );
      if (closeButton) {
        closeButton.click();
      }
    }
  }

  showModalProductLow(){
    this.modalProduct.openModal();
  }
}
