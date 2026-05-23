import { Routes } from '@angular/router';
import { Layout } from './shared/layout/layout';
import { Main } from './views/main/main';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        component: Main
      },
      {
        path: '',
        loadChildren: () => import ('./views/user/auth.routes').then(m => m.authRoutes)
      }
    ]
  }
];
