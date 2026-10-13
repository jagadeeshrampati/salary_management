import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';


export const routes: Routes = [
  {
    path: 'dashboard',
    component: Dashboard,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
