import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeadcountDepartment } from './components/headcount-department/headcount-department';
import { HeadcountCountry } from './components/headcount-country/headcount-country';
import { AverageCompensation } from './components/average-compensation/average-compensation';
import { DashboardService } from '../../core/services/dashboard';
import { DashboardResponse } from './dashboard.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    DatePipe,
    DecimalPipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatToolbarModule,
    HeadcountDepartment,
    HeadcountCountry,
    AverageCompensation
],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly dashboardService = inject(DashboardService);

  today = new Date();

  readonly dashboard = signal<DashboardResponse['data'] | null>(null);
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  readonly totalEmployees = computed(
    () => this.dashboard()?.summary.total_employees ?? 0,
  );

  readonly activeEmployees = computed(
    () => this.dashboard()?.summary.active_employees ?? 0,
  );

  readonly departmentHeadcount = computed(
    () => this.dashboard()?.headcount_by_department ?? [],
  );

  readonly countryHeadcount = computed(
    () => this.dashboard()?.headcount_by_country ?? [],
  );

  readonly compensationByDepartment = computed(
    () => this.dashboard()?.average_compensation_by_department ?? [],
  );

  constructor() {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.dashboardService.getDashboard().subscribe({
      next: (response) => {
        this.dashboard.set(response.data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load dashboard', error);
        this.errorMessage.set(
          'Unable to load dashboard data. Please try again.',
        );
        this.loading.set(false);
      },
    });
  }

}
