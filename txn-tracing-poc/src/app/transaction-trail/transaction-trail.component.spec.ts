import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTrailComponent } from './transaction-trail.component';

describe('TransactionTrailComponent', () => {
  let component: TransactionTrailComponent;
  let fixture: ComponentFixture<TransactionTrailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionTrailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
