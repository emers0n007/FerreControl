import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { AuthenticationService } from './service/authentication.service';
import { AlertService } from './service/alert.service';
import { ProductService } from './service/product.service';
import { ProductModel } from './model/ProductModel';

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

  constructor(private authService: AuthenticationService, private alertService: AlertService, private productService: ProductService, private renderer: Renderer2) {
    this.getProductLowStock();
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
    this.alertService.alert$.subscribe((res: any) => {
      this.mesage = res.message;
      this.okay = res.okay;
      this.showAlert = true;
      this.triggerShake();
      setTimeout(() => {this.showAlert = false}, res.time);
    });

  }

  openModal(){
    const modal = document.getElementById('staticBackdrop');
    if (modal) {
      this.renderer.removeClass(modal, 'modal-fade');
      modal.setAttribute('aria-hidden', 'false');
      modal.style.display = 'block';
    }
  }

  closeModal() {
    const modal = document.getElementById('staticBackdrop');
    if (modal) {
      this.renderer.addClass(modal, 'modal-fade');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
    }
  }

  getProductLowStock() {
    this.productService.getProductoLowStock().subscribe(
      (products: ProductModel[]) => {
        this.lowStockProducts = products;
        console.log('Productos con bajo stock:', this.lowStockProducts);
        if (this.lowStockProducts && this.lowStockProducts.length > 0) {
          this.openModal();
        }
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
