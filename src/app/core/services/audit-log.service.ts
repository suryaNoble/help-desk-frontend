import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { AuditLog } from '../models/audit-log.model';

@Injectable({ providedIn: 'root' })
export class AuditLogService {
  private api = inject(ApiService);

  getAllLogs(): Observable<AuditLog[]> {
    return this.api.get<AuditLog[]>('/audit-logs');
  }
}