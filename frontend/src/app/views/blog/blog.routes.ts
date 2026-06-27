import { Routes } from '@angular/router';

export const blogRoutes: Routes = [
  { path: 'blog', loadComponent: () => import('./blog/blog').then((m) => m.Blog) },
  { path: 'article/:url', loadComponent: () => import('./article/article').then((m) => m.Article) },
]
