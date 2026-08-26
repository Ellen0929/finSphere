import { Routes } from '@angular/router';
import { MainLayout } from './shared/layout/main-layout/main-layout';
import { Dashboard } from './features/dashboard/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        component: Dashboard
      }
    ]
  }
];
