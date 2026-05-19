import { Routes } from '@angular/router';
import { Layout } from './shared/layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        loadChildren: () => import ('./views/user/auth.routes').then(m => m.authRoutes)
      }
    ]
  }
];
