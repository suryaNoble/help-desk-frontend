import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { TicketService } from '../../../../core/services/ticket.service';

@Component({
  selector: 'app-ticket-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-history.component.html'
})
export class TicketHistoryComponent implements OnInit {
  private ticketService = inject(TicketService);
  
  historyLogs$!: Observable<any[]>;

  ngOnInit() {
    this.historyLogs$ = this.ticketService.getAllTicketHistory();
  }

  parseStatus(rawStatus: string): string {
    if (!rawStatus) return 'Unknown';
    
    try {
      // If it looks like a JSON string, parse it
      if (rawStatus.trim().startsWith('{')) {
        const parsed = JSON.parse(rawStatus);
        return parsed.status || 'Unknown';
      }
      // If it's already a normal string, just return it
      return rawStatus;
    } catch (e) {
      console.error('Failed to parse status:', rawStatus);
      return 'Error';
    }
  }

  // Helper method for status badge colors (Uses the cleaned status)
  getStatusClass(status: string): string {
    const cleanStatus = this.parseStatus(status).toLowerCase();
    
    if (cleanStatus === 'open') return 'bg-blue-100 text-blue-800';
    if (cleanStatus === 'inprogress') return 'bg-yellow-100 text-yellow-800';
    if (cleanStatus === 'resolved' || cleanStatus === 'completed') return 'bg-green-100 text-green-800';
    if (cleanStatus === 'closed') return 'bg-gray-200 text-gray-800';
    return 'bg-gray-100 text-gray-800';
  }
}