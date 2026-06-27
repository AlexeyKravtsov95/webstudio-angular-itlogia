import { Routes } from '@angular/router';
import { Layout } from './shared/layout/layout';
import { Main } from './views/main/main';
import { Blog } from './views/blog/blog/blog';

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
      },
      {
        path: '',
        loadChildren: () => import('./views/blog/blog.routes').then(m => m.blogRoutes)
      }
    ]
  }
];
