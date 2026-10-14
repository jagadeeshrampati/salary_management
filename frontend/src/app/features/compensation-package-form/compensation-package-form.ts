import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { EmployeeService } from '../../core/services/employee';

@Component({
  selector: 'app-compensation-package-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './compensation-package-form.html',
  styleUrl: './compensation-package-form.scss'
})
export class CompensationPackageForm {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly employeeService = inject(EmployeeService);

  readonly employeeId = Number(this.route.snapshot.paramMap.get('id'));
  readonly saving = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');

  readonly currencies = [
    { code: 'INR', label: 'INR — Indian Rupee' },
    { code: 'USD', label: 'USD — US Dollar' },
    { code: 'GBP', label: 'GBP — British Pound' },
    { code: 'EUR', label: 'EUR — Euro' },
    { code: 'SGD', label: 'SGD — Singapore Dollar' }
  ];

  readonly form = this.fb.group({
    currency: ['INR', Validators.required],
    effective_from: [this.todayLocal(), Validators.required],
    change_reason: ['', [
      Validators.required,
      Validators.maxLength(500)
    ]],
    basic_salary: ['', [
      Validators.required,
      Validators.min(0.01)
    ]],
    hra: ['0', [
      Validators.required,
      Validators.min(0)
    ]],
    special_allowance: ['0', [
      Validators.required,
      Validators.min(0)
    ]],
    performance_bonus: ['0', [
      Validators.required,
      Validators.min(0)
    ]],
    employer_pf: ['0', [
      Validators.required,
      Validators.min(0)
    ]]
  });

  constructor() {
    if (!Number.isInteger(this.employeeId) || this.employeeId <= 0) {
      this.errorMessage.set('Invalid employee ID.');
    }
  }

  private todayLocal(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  cancel(): void {
    this.router.navigate(['/employees', this.employeeId]);
  }

  save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    if (!Number.isInteger(this.employeeId) || this.employeeId <= 0) {
      this.errorMessage.set('Invalid employee ID.');
      return;
    }

    const value = this.form.getRawValue();

    const payload = {
      currency: value.currency!,
      effective_from: value.effective_from!,
      change_reason: value.change_reason!.trim(),
      items: [
        {
          component_type: 'basic_salary',
          category: 'fixed_earnings',
          amount: value.basic_salary!
        },
        {
          component_type: 'hra',
          category: 'fixed_earnings',
          amount: value.hra!
        },
        {
          component_type: 'special_allowance',
          category: 'fixed_earnings',
          amount: value.special_allowance!
        },
        {
          component_type: 'performance_bonus',
          category: 'variable_earnings',
          amount: value.performance_bonus!
        },
        {
          component_type: 'employer_pf',
          category: 'employer_contribution',
          amount: value.employer_pf!
        }
      ]
    };

    if (!payload.change_reason) {
      this.form.controls.change_reason.setErrors({ required: true });
      this.form.controls.change_reason.markAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.employeeService
      .createCompensationPackage(this.employeeId, payload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.successMessage.set(
            'Compensation package created successfully!'
          );

          setTimeout(() => {
            this.router.navigate(['/employees', this.employeeId]);
          }, 1200);
        },
        error: error => {
          const errors = error.error?.errors;

          this.errorMessage.set(
            Array.isArray(errors)
              ? errors.join(', ')
              : error.error?.message ??
                error.error?.error ??
                'Unable to create compensation package. Please try again.'
          );
        }
      });
  }
}