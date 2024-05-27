import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { AuthenticationService } from './service/authentication.service';
import { AlertService } from './service/alert.service';
import { ProductService } from './service/product.service';
import { ProductModel } from './model/ProductModel';
import { ModalProductsLowService } from './service/modal-products-low.service';
import { SharedProductService } from './service/shared-product.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  title = 'FerreControl (FC)';
  showAlert = false;
  okay: boolean = false;
  mesage = '';
  shakeAlert: boolean = false;
  navbarVisible: boolean = true;
  lowStockProducts: ProductModel[] = [];
  private readonly AUTH_USER = 'No debe estar aqui';

  constructor(private authService: AuthenticationService, private alertService: AlertService, private productService: ProductService, private renderer: Renderer2, private modalService: ModalProductsLowService, private sharedProduct: SharedProductService) {

  }



  get userOn(): boolean {
    return this.authService.usuarioAutenticado;
  }

  toggleNavbar() {
    this.navbarVisible = !this.navbarVisible;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkWindowSize();
  }

  private checkWindowSize() {
    if (window.innerWidth < 1180) {
      this.navbarVisible = false;
    } else {
      this.navbarVisible = true;
    }
  }
  ngOnInit(): void {
    this.sharedProduct.lowStockProducts$.subscribe(products => {
      this.lowStockProducts = products;
    });
    //this.getProductLowStock();
    this.alertService.alert$.subscribe((res: any) => {
      this.mesage = res.message;
      this.okay = res.okay;
      this.showAlert = true;
      this.triggerShake();
      setTimeout(() => {this.showAlert = false}, res.time);
    });


  }

  openModal(){
    this.modalService.openModal();
  }

  closeModal() {
   this.modalService.closeModal();
  }

  createUserAux(){
    const user={
      name_user:localStorage.getItem(this.AUTH_USER)
    }

    return user;
  }

  getProductLowStock() {
    this.productService.getProductoLowStock(this.createUserAux().name_user).subscribe(
      (products: ProductModel[]) => {
        this.sharedProduct.updateLowStockProducts(products);
      },
      error => {
        console.error('Error al obtener productos con bajo stock:', error);
      }
    );
  }

  triggerShake() {
    this.shakeAlert = true;
    setTimeout(() => {
      this.shakeAlert = false;
    }, 300);
  }
}
