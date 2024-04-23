import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { ProductModel } from '../../model/ProductModel';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { AlertService } from 'src/app/service/alert.service';
import { SupplierModel } from '../../model/SupplierModel';
import { SupplierService } from '../../service/supplier.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  list: ProductModel[] = [];
  listSuppliers: SupplierModel[] = [];
  listComplet: ProductModel[] = [];
  formProduct: FormGroup = new FormGroup({});
  isUpdate: boolean = false;
  filteredProducts: ProductModel[] = [];
  selectedSupplierId: number = 0;
  mensaje: String = '';

  constructor(
    private producService: ProductService,
    private alertService: AlertService,
    private supplierService: SupplierService
  ) {}
  ngOnInit(): void {
    this.listProducts();
    this.listSupplier();
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
    this.filteredProducts = term.length < 1 ? this.listComplet : this.listComplet.filter((product) =>
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
      this.mensaje = ''
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
          email: supplierEmail,
        },
        presentation:this.formProduct.controls['presentation'].value,
        description_presentation:this.formProduct.controls['description_presentation'].value,
        mark:{
          id_mark: this.formProduct.controls['id_mark'].value,
          name_mark:' '
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
    } else {
      this.mensaje = "Ingresa todos los campos correctamente";
    }

  }

  resetMessage(){
    this.mensaje = '';
  }

  update() {
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
        email: supplierEmail,
      },
      status: 1,
    };
    this.producService.updateProduct(productData).subscribe((resp) => {
      if (resp) {
        this.console.log(resp);
        this.showAlert(resp.message, resp.seccess);
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
    this.formProduct.controls['id_supplier'].setValue(item.supplier.id_supplier);
    this.formProduct.controls['status'].setValue(item.status);
    this.selectedSupplierId = item.supplier.id_supplier;

  }

  protected readonly console = console;
}
