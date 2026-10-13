import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadcountDepartment } from './headcount-department';

describe('HeadcountDepartment', () => {
  let component: HeadcountDepartment;
  let fixture: ComponentFixture<HeadcountDepartment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadcountDepartment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadcountDepartment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
