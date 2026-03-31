import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'admin',
    // component: () => import('./layout/admin-layout/admin-layout.component').then(c => c.AdminLayoutComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: 'Admin' },
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'employee',
    // component: () => import('./layout/employee-layout/employee-layout.component').then(c => c.EmployeeLayoutComponent),
    canActivate: [authGuard],
    loadChildren: () => import('./features/employee/employee.routes').then(m => m.EMPLOYEE_ROUTES)
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  //instead of 404 we redirect to login 
  { path: '**', redirectTo: 'auth/login' }
];