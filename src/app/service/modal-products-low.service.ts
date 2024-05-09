import { Injectable } from '@angular/core';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class ModalProductsLowService {

  constructor(private alertService: AlertService) { }


  showAlert(message: string, okay: boolean) {
    this.alertService.showAlert(message, okay);
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
    this.showAlert("Existen Productos con Bajo Stock", false);
    setTimeout(() => {
      const modal = document.getElementById('staticBackdrop');
      if (modal) {
        modal.classList.remove('modal-fade');
        modal.setAttribute('aria-hidden', 'false');
        modal.style.display = 'block';
      }
    }, 1500); // 2000 milisegundos = 2 segundos
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
