import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  { path: 'signup', loadComponent: () => import('./signup/signup').then((m) => m.Signup) },
  { path: 'login', loadComponent: () => import('./login/login').then((m) => m.Login) },
];
