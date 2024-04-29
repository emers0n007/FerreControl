import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { MarkModel } from 'src/app/model/MarkModel';
import { SupplierModel } from 'src/app/model/SupplierModel';
import { AlertService } from 'src/app/service/alert.service';
import { ProductService } from 'src/app/service/product.service';
import { SupplierService } from 'src/app/service/supplier.service';

@Component({
  selector: 'app-modal-new-product',
  templateUrl: './modal-new-product.component.html',
  styleUrls: ['./modal-new-product.component.css']
})
export class ModalNewProductComponent implements OnInit{
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  formProduct: FormGroup = new FormGroup({});
  listSuppliers: SupplierModel[] = [];
  selectedSupplier: SupplierModel | undefined;
  selectedPresentation: string = '';
  listMarks: MarkModel[] = [];
  mensaje: string = '';
  presentationOptions = [
    { id: '1', label: 'Bulto', value: 'Bulto' },
    { id: '2', label: 'Caja', value: 'Caja' },
    { id: '3', label: 'Metro', value: 'Metro' },
  ];

  constructor(private supplierService: SupplierService, private producService: ProductService, private alertService: AlertService){

  }

  ngOnInit(): void {
    this.listSupplier();
    this.getListMarks();
    this.formProduct = new FormGroup({
      name: new FormControl('', Validators.required),
      id_product: new FormControl('', Validators.required),
      stock: new FormControl('0'),
      price_buy: new FormControl('', Validators.required),
      price_sale: new FormControl('', Validators.required),
      id_supplier: new FormControl('', Validators.required),
      status: new FormControl('1'),
      presentation: new FormControl(''),
      description_presentation: new FormControl(''),
      id_mark: new FormControl(''),
      OtherMark: new FormControl(''),
      units: new FormControl('')
    });
  }

  generateUniqueId(): any {
    // Obtener la marca de tiempo actual en milisegundos
    const timestamp = new Date().getTime();

    // Generar un número aleatorio entre 0 y 9999
    const randomNumber = Math.floor(Math.random() * 10000);

    // Concatenar la marca de tiempo y el número aleatorio para crear el ID único
    const uniqueId = timestamp.toString() + randomNumber.toString();

    return randomNumber;
  }

  save() {
    if (this.formProduct.valid) {
      this.mensaje = '';
      const supplierId = this.formProduct.controls['id_supplier'].value.id_supplier;
      const supplierName = ' ';
      const supplierPhone = ' ';
      const supplierEmail = ' ';

      const markControl = this.formProduct.controls['id_mark'];
      let markName: string;
      let markId: any;

      // Verificar si la marca es "Otro"
      if (markControl.value === 'Otro') {
        markName = this.formProduct.controls['OtherMark'].value;
        markId = this.generateUniqueId(); // Asume que tienes una función que genera IDs únicos
      } else {
        // Si no es "Otro", mantener los valores existentes
        markName = markControl.value.name_mark;
        markId = markControl.value.id_mark;
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
        presentation: this.formProduct.controls['presentation'].value,
        description_presentation:
          this.formProduct.controls['description_presentation'].value,
        mark: {
          id_mark: markId,
          name_mark: markName,
        },
        status: 1,
      };
      this.producService.saveProduct(productData).subscribe((resp) => {
        if (resp) {
          this.console.log(resp);
          this.closeModal.emit();
          this.showAlert(resp.message, resp.success);
          //this.listProducts();
          this.formProduct.reset();
        }
      });
    } else {
      this.mensaje = 'Ingresa todos los campos correctamente';
    }
  }




  showAlert(message: string, okay: boolean) {
    this.alertService.showAlert(message, okay);
  }

  selectedSupplierTwo: SupplierModel | undefined;

  searchSupplier = (text$: Observable<string>): Observable<SupplierModel[]> =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 1
          ? this.listSuppliers
          : this.listSuppliers
              .filter(
                (v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
    );

    formatSupplier = (supplier: SupplierModel) =>
      supplier.name ? supplier.name.toString() : '';

    onSupplierSelect(event: NgbTypeaheadSelectItemEvent) {
      this.selectedSupplier = event.item;
    }

    listSupplier() {
      this.supplierService.getSupplier().subscribe((resp) => {
        if (resp) {
          this.listSuppliers = resp;
        }
      });
    }

    getListMarks() {
      this.producService.getMarks().subscribe((resp) => {
        if (resp) {
          this.listMarks = resp;
          const newMark = { id_mark: 9999, name_mark: 'Otro' };

          this.listMarks.push(newMark);
        }
      });
    }

    selectedMark: MarkModel | undefined;

    searchMark = (text$: Observable<string>): Observable<MarkModel[]> =>
      text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        map((term) =>
          term.length < 2
            ? this.listMarks
            : this.listMarks
                .filter(
                  (v) =>
                    v.name_mark.toLowerCase().indexOf(term.toLowerCase()) > -1
                )
                .slice(0, 10)
        )
      );

    formatMark = (mark: MarkModel) =>
      mark.name_mark ? mark.name_mark.toString() : '';

    onMarkSelect(event: NgbTypeaheadSelectItemEvent) {
      this.selectedMark = event.item;
    }

  newProduct() {
    this.formProduct.reset();
  }

  protected readonly console = console;
}
