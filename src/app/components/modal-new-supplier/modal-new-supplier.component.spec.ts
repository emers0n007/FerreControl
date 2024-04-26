import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewSupplierComponent } from './modal-new-supplier.component';

describe('ModalNewSupplierComponent', () => {
  let component: ModalNewSupplierComponent;
  let fixture: ComponentFixture<ModalNewSupplierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalNewSupplierComponent]
    });
    fixture = TestBed.createComponent(ModalNewSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
