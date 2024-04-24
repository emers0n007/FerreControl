import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { ProductModel } from '../../model/ProductModel';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { AlertService } from 'src/app/service/alert.service';
import { SupplierModel } from '../../model/SupplierModel';
import { SupplierService } from '../../service/supplier.service';
import { MarkModel } from '../../model/MarkModel';
import { Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';

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
  mensaje: String = '';
  checklistForm: FormGroup;

  selectedPresentation: string = '';

  presentationOptions = [
    { id: '1', label: 'Bulto', value: 'Bulto' },
    { id: '2', label: 'Caja', value: 'Caja' },
    { id: '3', label: 'Metro', value: 'Metro' },
    { id: '4', label: 'Otro', value: 'Otro' },
  ];

  constructor(
    private producService: ProductService,
    private alertService: AlertService,
    private supplierService: SupplierService,
    private formBuilder: FormBuilder
  ) {
    this.checklistForm = this.formBuilder.group({
      presentation: [],
    });
  }

  ngOnInit(): void {
    this.listProducts();
    this.listSupplier();
    this.getListMarks();
    this.formProduct = new FormGroup({
      name: new FormControl('', Validators.required),
      id_product: new FormControl('', Validators.required),
      stock: new FormControl('', Validators.required),
      price_buy: new FormControl('', Validators.required),
      price_sale: new FormControl('', Validators.required),
      id_supplier: new FormControl('', Validators.required),
      status: new FormControl('1'),
      presentation: new FormControl(' '),
      description_presentation: new FormControl(' '),
      id_mark: new FormControl(' '),
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
    this.formProduct.reset();
  }

  showAlert(message: string, okay: boolean) {
    this.alertService.showAlert(message, okay);
  }

  save() {
    if (this.formProduct.valid) {
      this.mensaje = '';
      const supplierId = this.formProduct.controls['id_supplier'].value.id_supplier;
      const supplierName = ' ';
      const supplierPhone = ' ';
      const supplierEmail = ' ';

      const selectedPresentation = this.formProduct.controls['presentation'].value;

      let presentation;
      if (selectedPresentation === 'Otro') {
        presentation = this.formProduct.controls['otherpresentation'].value;
      } else {
        presentation = selectedPresentation;
      }

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
        presentation: presentation,
        description_presentation:
          this.formProduct.controls['description_presentation'].value,
        mark: {
          id_mark: this.formProduct.controls['id_mark'].value.id_mark,
          name_mark: ' ',
        },
        status: 1,
      };
      this.producService.saveProduct(productData).subscribe((resp) => {
        if (resp) {
          this.console.log(resp);
          this.showAlert(resp.message, resp.success);
          this.listProducts();
          this.formProduct.reset();
        }
      });
      console.log(productData);
    } else {
      this.mensaje = 'Ingresa todos los campos correctamente';
    }
  }

  resetMessage() {
    this.mensaje = '';
  }

  update() {
    const supplierId = this.formProduct.controls['id_supplier'].value.id_supplier;
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
      presentation: this.formProduct.controls['presentation'].value,
      description_presentation:this.formProduct.controls['description_presentation'].value,
      mark: {
        id_mark: this.formProduct.controls['id_mark'].value.id_mark,
        name_mark: ' ',
      },
      status: 1,
    };
    this.producService.updateProduct(productData).subscribe((resp) => {
      if (resp) {
        this.console.log(resp);
        this.showAlert(resp.message, resp.success);
        this.listProducts();
        this.formProduct.reset();
      }
    });
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
    this.formProduct.controls['name'].setValue(item.name);
    this.formProduct.controls['id_product'].setValue(item.id_product);
    this.formProduct.controls['stock'].setValue(item.stock);
    this.formProduct.controls['price_buy'].setValue(item.price_buy);
    this.formProduct.controls['price_sale'].setValue(item.price_sale);
    this.formProduct.controls['id_supplier'].setValue(
      item.supplier.id_supplier
    );
    this.selectedSupplier = item.supplier;
    this.console.log(this.selectedSupplier)
    this.formProduct.controls['status'].setValue(item.status);
    this.formProduct.controls['id_mark'].setValue(item.mark.id_mark);
    this.selectedMark = item.mark;
    this.formProduct.controls['presentation'].setValue(item.presentation);
    this.formProduct.controls['description_presentation'].setValue(
      item.description_presentation
    );
  }


  selectedSupplier: SupplierModel | undefined;

  search = (text$: Observable<string>): Observable<SupplierModel[]> =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 1 ? this.listSuppliers : this.listSuppliers.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

    formatSupplier = (supplier: SupplierModel) => supplier.name ? supplier.name.toString() : '';

  onSupplierSelect(event: NgbTypeaheadSelectItemEvent) {
    this.selectedSupplier = event.item;
  }

  protected readonly console = console;


  selectedMark: MarkModel | undefined;

  searchMark = (text$: Observable<string>): Observable<MarkModel[]> =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 1 ? this.listMarks : this.listMarks.filter(v => v.name_mark.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

    formatMark = (mark: MarkModel) => mark.name_mark ? mark.name_mark.toString() : '';

  onMarkSelect(event: NgbTypeaheadSelectItemEvent) {
    this.selectedMark = event.item;
  }

}
