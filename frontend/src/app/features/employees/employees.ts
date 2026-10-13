import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { EmployeeService } from '../../core/services/employee';
import { Employee, EmployeeFilters } from './employee.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
  ],
  templateUrl: './employees.html',
  styleUrl: './employees.scss',
})
export class Employees {
  private readonly employeeService = inject(EmployeeService);

  readonly employees = signal<Employee[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  readonly displayedColumns = [
    'employee_code',
    'full_name',
    'department',
    'country_code',
    'job_title',
    'status',
  ];

  readonly countries = [
    { code: 'IN', name: 'India' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'SG', name: 'Singapore' },
  ];

  readonly departments = [
    'Engineering',
    'HR',
    'Finance',
    'Sales',
    'Operations',
  ];

  search = '';
  countryCode = '';
  department = '';
  status = '';

  pageIndex = 0;
  pageSize = 20;
  total = 0;

  sortBy = 'employee_code';
  direction: 'asc' | 'desc' = 'asc';

  constructor() {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    const filters: EmployeeFilters = {
      search: this.search,
      country_code: this.countryCode,
      department: this.department,
      status: this.status,
      sort_by: this.sortBy,
      direction: this.direction,
      page: this.pageIndex + 1,
      limit: this.pageSize,
    };

    this.employeeService.getEmployees(filters).subscribe({
      next: (response) => {
        this.employees.set(response.data);
        this.total = response.pagination.total;
        console.log(response, 'employees response')
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load employees', error);
        this.errorMessage.set(
          'Unable to load employees. Please try again.',
        );
        this.loading.set(false);
      },
    });
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.loadEmployees();
  }

  clearFilters(): void {
    this.search = '';
    this.countryCode = '';
    this.department = '';
    this.status = '';
    this.pageIndex = 0;
    this.loadEmployees();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadEmployees();
  }

  onSortChange(sort: Sort): void {
    if (!sort.direction) {
      this.sortBy = 'employee_code';
      this.direction = 'asc';
    } else {
      this.sortBy = sort.active;
      this.direction = sort.direction;
    }

    this.pageIndex = 0;
    this.loadEmployees();
  }

  trackEmployee(_: number, employee: Employee): number {
    return employee.id;
  }
}
