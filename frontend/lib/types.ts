export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  job_title: string;
  country: string;
  department: string;
  salary: string;
  date_joined: string;
  is_active: boolean;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type DashboardMetrics = {
  total_employees: number;
  avg_salary: number | null;
  countries: number;
  payroll: number | null;
};

export type CountryInsight = {
  country: string;
  avg_salary: number;
  min_salary: number;
  max_salary: number;
  employee_count: number;
};
