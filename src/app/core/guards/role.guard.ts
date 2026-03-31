import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
//   const expectedRole = route.data['role']; // e.g., 'Admin'
  const user = authService.currentUser();

  if (!user || !user.role) {
    console.error('No user or role found in Signal');
    router.navigate(['/auth/login']);
    return false;
  }

  const clean = (str: string) => str.replace(/['"]+/g, '').trim().toLowerCase();
  const userRole = clean(user.role);
  const expectedRole = clean(route.data['role'] || '');


  console.log("role.guard.ts file ")
console.log('Final Clean Comparison:', `"${userRole}" === "${expectedRole}"`);  
if (user && userRole === expectedRole) {
    return true;
  }
console.log('Role Mismatch - Redirecting to Login');
  router.navigate(['/employee/dashboard']); // Redirect if role doesn't match
  return false;
};