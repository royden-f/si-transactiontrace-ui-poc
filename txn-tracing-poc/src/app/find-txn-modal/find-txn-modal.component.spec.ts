import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindTxnModalComponent } from './find-txn-modal.component';

describe('FindTxnModalComponent', () => {
  let component: FindTxnModalComponent;
  let fixture: ComponentFixture<FindTxnModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindTxnModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindTxnModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
