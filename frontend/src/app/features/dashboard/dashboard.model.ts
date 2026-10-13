export interface DashboardResponse {
  data: {
    summary: {
      total_employees: number;
      active_employees: number;
    };
    headcount_by_department: {
      department: string;
      count: number;
    }[];
    headcount_by_country: {
      country_code: string;
      count: number;
    }[];
    average_compensation_by_department: {
      department: string;
      currency: string;
      average_annual_compensation: string;
    }[];
  };
}
