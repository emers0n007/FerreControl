import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalProductsLowService {

  constructor() { }

  openModal() {
    const modal = document.getElementById('staticBackdrop');
    if (modal) {
      modal.classList.remove('modal-fade');
      modal.setAttribute('aria-hidden', 'false');
      modal.style.display = 'block';
    }
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
