import { Injectable } from '@angular/core';
import { ProductModel } from '../model/ProductModel';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedProductService {
  private lowStockProductsSource = new BehaviorSubject<ProductModel[]>([]);
  lowStockProducts$ = this.lowStockProductsSource.asObservable();

  updateLowStockProducts(products: ProductModel[]) {
    this.lowStockProductsSource.next(products);
  }
  constructor() { }
}
