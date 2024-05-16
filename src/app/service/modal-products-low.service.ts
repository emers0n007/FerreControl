import { Injectable } from '@angular/core';
import { AlertService } from './alert.service';
import { ProductService } from './product.service';
import { ProductModel } from '../model/ProductModel';

@Injectable({
  providedIn: 'root'
})
export class ModalProductsLowService {

  lowStockProducts: ProductModel[] = [];

  constructor(private alertService: AlertService, private productService: ProductService) { }


  showAlert(message: string, okay: boolean) {
    this.alertService.showAlert(message, okay);
  }

  openModal() {
    this.getProductLowStock();
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
    this.productService.getProductoLowStock().subscribe(
      (products: ProductModel[]) => {
        this.lowStockProducts = products;
        if (this.lowStockProducts && this.lowStockProducts.length > 0) {
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
