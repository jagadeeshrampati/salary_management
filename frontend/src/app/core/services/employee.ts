import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompensationPackage, CompensationPackagesResponse, EmployeeDetailsResponse, EmployeeFilters, EmployeeListResponse } from '../../features/employees/employee.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/employees`;

  getEmployees(filters: EmployeeFilters): Observable<EmployeeListResponse> {
    let params = new HttpParams()
      .set('page', filters.page)
      .set('limit', filters.limit)
      .set('sort_by', filters.sort_by)
      .set('direction', filters.direction);

    if (filters.search.trim()) {
      params = params.set('search', filters.search.trim());
    }

    if (filters.country_code) {
      params = params.set('country_code', filters.country_code);
    }

    if (filters.department) {
      params = params.set('department', filters.department);
    }

    if (filters.status) {
      params = params.set('status', filters.status);
    }

    return this.http.get<EmployeeListResponse>(this.apiUrl, { params });
  }

  getEmployee(id: number): Observable<EmployeeDetailsResponse> {
    return this.http.get<EmployeeDetailsResponse>(
      `${environment.apiUrl}/employees/${id}`
    );
  }

  getCompensationPackages(
    employeeId: number
  ): Observable<CompensationPackagesResponse> {
    return this.http.get<CompensationPackagesResponse>(
      `${environment.apiUrl}/employees/${employeeId}/compensation_packages`
    );
  }

  createCompensationPackage(
    employeeId: number,
    payload: {
      currency: string;
      effective_from: string;
      change_reason: string;
      items: {
        component_type: string;
        category: string;
        amount: string;
      }[];
    }
  ): Observable<{ data: CompensationPackage }> {
    return this.http.post<{ data: CompensationPackage }>(
      `${environment.apiUrl}/employees/${employeeId}/compensation_packages`,
      { compensation_package: payload }
    );
  }
}


