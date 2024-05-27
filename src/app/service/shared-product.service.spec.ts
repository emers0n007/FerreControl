import { TestBed } from '@angular/core/testing';

import { SharedProductService } from './shared-product.service';

describe('SharedProductService', () => {
  let service: SharedProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
