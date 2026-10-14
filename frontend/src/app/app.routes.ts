import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Employees } from './features/employees/employees';
import { MainLayout } from './layout/main-layout/main-layout';
import { EmployeeDetails } from './features/employee-details/employee-details';
import { CompensationPackageForm } from './features/compensation-package-form/compensation-package-form';


export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        data: { breadcrumb: 'Dashboard' }
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'employees',
        component: Employees,
        data: { breadcrumb: 'Employees' }
      },
      {
        path: 'employees/:id',
        component: EmployeeDetails,
        data: { breadcrumb: 'Employee Details' }
      },
      {
        path: 'employees/:id/compensation/new',
        component: CompensationPackageForm,
        data: { breadcrumb: 'New Compensation Package' }
      }
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
