import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { Employees } from './features/employees/employees';
import { MainLayout } from './layout/main-layout/main-layout';


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
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
