
export interface Employee {
  id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  country_code: string;
  department: string;
  job_title: string;
  status: 'active' | 'on_leave' | 'terminated';
}

export interface EmployeeListResponse {
  data: Employee[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface EmployeeFilters {
  search: string;
  country_code: string;
  department: string;
  status: string;
  sort_by: string;
  direction: 'asc' | 'desc';
  page: number;
  limit: number;
}
