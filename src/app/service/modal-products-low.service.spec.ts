import { TestBed } from '@angular/core/testing';

import { ModalProductsLowService } from './modal-products-low.service';

describe('ModalProductsLowService', () => {
  let service: ModalProductsLowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalProductsLowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
