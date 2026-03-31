import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = inject(ApiService);
  private http = inject(HttpClient);

  // Fetch all users for the Admin dropdown
  getAllUsers(): Observable<User[]> {
    return this.api.get<User[]>('/users');
  }

  createUser(userData: any): Observable<any> {
  return this.http.post('http://localhost:8080/auth/register', userData, {
      responseType: 'text' 
    });
  }
}