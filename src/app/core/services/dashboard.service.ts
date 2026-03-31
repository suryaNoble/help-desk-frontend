import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { DashboardStats } from '../models/dashboard-stats.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private api = inject(ApiService);

  getDashboardStats(): Observable<DashboardStats> {
    // Calling the exact endpoint you provided
    return this.api.get<DashboardStats>('/api/dashboard/stats');
  }
}