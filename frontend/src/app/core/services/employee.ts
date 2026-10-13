import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EmployeeFilters, EmployeeListResponse } from '../../features/employees/employee.model';
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
}


