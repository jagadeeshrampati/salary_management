import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompensationPackageForm } from './compensation-package-form';

describe('CompensationPackageForm', () => {
  let component: CompensationPackageForm;
  let fixture: ComponentFixture<CompensationPackageForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompensationPackageForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompensationPackageForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
