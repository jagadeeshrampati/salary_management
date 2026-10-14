import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { EmployeeService } from '../../core/services/employee';
import { CompensationPackage, Employee } from '../employees/employee.model';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [DatePipe, RouterLink, TitleCasePipe],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.scss'
})
export class EmployeeDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly employeeService = inject(EmployeeService);
  private readonly router = inject(Router);

  readonly employee = signal<Employee | null>(null);
  readonly packages = signal<CompensationPackage[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');

  readonly currentPackage = computed(() =>
  this.packages().find(pkg => !pkg.effective_to) ?? null
  );

  readonly sortedPackages = computed(() =>
  [...this.packages()].sort((a, b) =>
  b.effective_from.localeCompare(a.effective_from)
  )
  );

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.errorMessage.set('Invalid employee ID.');
      this.loading.set(false);
      return;
    }

    this.loadCompensationPackages(id);
  }


  startNewPackage(): void {
    const employeeId = this.employee()?.id;

    if (!employeeId) {
      return;
    }

    this.router.navigate([
      '/employees',
      employeeId,
      'compensation',
      'new'
    ]);
  }
  loadCompensationPackages(employeeId: number): void {
    forkJoin({
      employee: this.employeeService.getEmployee(employeeId),
      compensation: this.employeeService.getCompensationPackages(employeeId)
    }).subscribe({
      next: result => {
        this.employee.set(result.employee.data);
        this.packages.set(result.compensation.data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load employee details.');
        this.loading.set(false);
      }
    });
  }
}