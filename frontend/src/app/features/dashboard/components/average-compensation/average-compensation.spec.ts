import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AverageCompensation } from './average-compensation';

describe('AverageCompensation', () => {
  let component: AverageCompensation;
  let fixture: ComponentFixture<AverageCompensation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AverageCompensation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AverageCompensation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
