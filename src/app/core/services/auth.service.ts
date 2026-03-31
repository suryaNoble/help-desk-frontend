import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);

  private userFromStorage = JSON.parse(localStorage.getItem('user_data') || 'null');
currentUser = signal<any | null>(JSON.parse(localStorage.getItem('user_data') || 'null'));  // Computed Signal to check if logged in
userId = computed(() => this.currentUser()?.id);
  userRole = computed(() => this.currentUser()?.role);
  isLoggedIn = computed(() => !!this.currentUser());
  

  login(credentials: any) {
    return this.api.post<any>('/auth/login', credentials).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user_data', JSON.stringify(res));
        this.currentUser.set(res); // Store user data (id, email, role)
      console.log('Token stored and User Signal updated printing res',res,localStorage.getItem('token'), this.currentUser());
    console.log('above line in authservice.ts file storing user data');  
  
  })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserData() {
    return this.currentUser();
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }
}