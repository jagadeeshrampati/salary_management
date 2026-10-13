import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadcountCountry } from './headcount-country';

describe('HeadcountCountry', () => {
  let component: HeadcountCountry;
  let fixture: ComponentFixture<HeadcountCountry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadcountCountry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadcountCountry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
