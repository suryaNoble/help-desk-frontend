import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditLogService } from '../../../core/services/audit-log.service';
import { AuditLog } from '../../../core/models/audit-log.model';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit-logs.component.html'
})
export class AuditLogsComponent implements OnInit {
  private auditLogService = inject(AuditLogService);
 private cdr = inject(ChangeDetectorRef);
  logs: AuditLog[] = [];
  isLoading = true;

  ngOnInit() {
    this.auditLogService.getAllLogs().subscribe({
      next: (data) => {
        this.logs = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load audit logs', err);
        this.isLoading = false;
        this.cdr.detectChanges();

      }
    });
  }

  // Helper method to format status badges cleanly
  getStatusClass(status: string): string {
    const s = status?.toLowerCase() || '';
    if (s === 'open' || s === 'available') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (s === 'inprogress' || s === 'assigned') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (s === 'resolved' || s === 'completed') return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}