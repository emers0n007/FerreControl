import { Component } from '@angular/core';
import { Observable, Subscription, distinctUntilChanged, interval, map } from 'rxjs';
import { ProductModel } from 'src/app/model/ProductModel';
import { AlertService } from 'src/app/service/alert.service';
import { ProductService } from 'src/app/service/product.service';
import { SaleService } from 'src/app/service/sale.service';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent {
  currentDate: Date = new Date();
  selectedItem: ProductModel | undefined;
  list: ProductModel[] = [];
  listComplet: ProductModel[] = [];
  filteredPro: ProductModel[] = [];
  productsFact: ProductModel[] = [];
  private readonly AUTH_USERNAME = 'Desconocido';
  private readonly AUTH_USER = 'No debe estar aqui';
  username: string | null = '';
  private subscription: Subscription;
  stockToAdd: number = 0;
  mensaje: string = '';
  uuid: string = '';


  constructor(
    private producService: ProductService,
    private alertService: AlertService,
    private saleService: SaleService
  ) {
    this.subscription = interval(1000).subscribe(() => {
      this.currentDate = new Date();
    });
  }
  ngOnInit(): void {
    this.username = localStorage.getItem(this.AUTH_USERNAME);
    this.listProducts();
    this.currentDate = new Date();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  listProducts() {
    this.producService.getProducts().subscribe((resp) => {
      if (resp) {
        this.list = [...resp]; // Clonar los datos para list
        this.listComplet = [...resp]; // Clonar los datos para listComplet
      }
    });
  }




  search = (text$: Observable<string>) =>
    text$.pipe(
      distinctUntilChanged(),
      map((term) => {
        const lowercaseTerm = term.toLowerCase();
        this.filteredPro =
          lowercaseTerm.length < 1
            ? this.listComplet
            : this.listComplet.filter((product) => {
                const includesTerm = product.name
                  .toLowerCase()
                  .includes(lowercaseTerm);
                return includesTerm;
              });
        this.list = this.filteredPro;
        return [];
      })
    );

  selectItem(item: any) {
    this.selectedItem = Object.assign({}, item);
  }

  addProduct() {
    if (this.selectedItem) {
      const index = this.list.findIndex(
        (item) => item.id_product === this.selectedItem?.id_product
      );
      if (index !== -1) {
        this.list.splice(index, 1);
        this.selectedItem.quantity = this.stockToAdd;
        this.productsFact.push(this.selectedItem);
      }
      this.selectedItem = undefined; // Restablece el valor
    }
  }

  addAll(item: any) {

    const index = this.productsFact.indexOf(item);
    if (index !== -1) {
      this.productsFact.splice(index, 1);
      const productToAdd = this.listComplet.find((product) => {
        return product.id_product === item.id_product;
      });
      if (productToAdd) {
        this.list.push(productToAdd);
      }
    }
  }


  showAlert(message: string, okay: boolean) {
    this.alertService.showAlert(message, okay);
  }

  saveSale() {
    if (this.uuid != '') {
      const saleData = {
        id_sale: this.uuid,
        sale_date: this.currentDate,
        total_price: 0,
        saleDetail: this.productsFact,
        name_user: localStorage.getItem(this.AUTH_USER)
      };
      console.log("Salida", saleData);
      this.saleService.saveSupplier(saleData).subscribe((resp) => {
        if (resp) {
          this.console.log(resp);
          this.showAlert(resp.message, resp.success);
          this.listProducts();
        }
      });
    } else {
      this.showAlert('Completa todos los campos requeridos', false);
    }
  }


  protected readonly console = console;

}
