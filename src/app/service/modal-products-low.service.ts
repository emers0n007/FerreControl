import { Injectable } from '@angular/core';
import { AlertService } from './alert.service';
import { ProductService } from './product.service';
import { ProductModel } from '../model/ProductModel';
import { SharedProductService } from './shared-product.service';

@Injectable({
  providedIn: 'root'
})
export class ModalProductsLowService {

  lowStockProducts: ProductModel[] = [];
  private readonly AUTH_USER = 'No debe estar aqui';

  constructor(private alertService: AlertService, private productService: ProductService, private sharedProduct: SharedProductService) { }


  showAlert(message: string, okay: boolean) {
    this.alertService.showAlert(message, okay);
  }

  createUserAux(){
    const user={
      name_user:localStorage.getItem(this.AUTH_USER)
    }
    return user;
  }

  openModal() {
    const modal = document.getElementById('staticBackdrop');
    if (modal) {
      modal.classList.remove('modal-fade');
      modal.setAttribute('aria-hidden', 'false');
      modal.style.display = 'block';
    }
  }
  openModalDelayed() {
    this.getProductLowStock();
  }

  getProductLowStock() {
    this.productService.getProductoLowStock(this.createUserAux().name_user).subscribe(
      (products: ProductModel[]) => {
        this.lowStockProducts = products;
        this.sharedProduct.updateLowStockProducts(products);
        if (this.lowStockProducts && this.lowStockProducts.length > 0 && products != null) {
          this.showAlert("Existen Productos con Bajo Stock", false);
          setTimeout(() => {
            const modal = document.getElementById('staticBackdrop');
            if (modal) {
              modal.classList.remove('modal-fade');
              modal.setAttribute('aria-hidden', 'false');
              modal.style.display = 'block';
            }
          }, 1500);
        }
      },
      error => {
        console.error('Error al obtener productos con bajo stock:', error);
      }
    );
  }




  closeModal() {
    const modal = document.getElementById('staticBackdrop');
    if (modal) {
      modal.classList.add('modal-fade');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
    }
  }
}
