import { Component, inject, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../../../core/services/ticket.service';
import { Ticket } from '../../../../core/models/ticket.model';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-list.component.html'
})
export class TicketListComponent implements OnInit {
  private ticketService = inject(TicketService);
private cdr = inject(ChangeDetectorRef);

  allTickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  isLoading = true;
  searchTerm = '';

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.isLoading = true;
    this.ticketService.getAllTickets().subscribe({
      next: (data) => {
        this.allTickets = data;
        this.filteredTickets = data;
        this.isLoading = false;
        this.cdr.detectChanges();

      },
      error: (err) => {
        console.error('Failed to load tickets', err);
        this.isLoading = false;
        this.cdr.detectChanges();

      }
    });
  }

  filterTickets() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredTickets = this.allTickets;
      return;
    }

    this.filteredTickets = this.allTickets.filter(ticket => 
      ticket.title?.toLowerCase().includes(term) ||
      ticket.id.toString().includes(term) ||
      ticket.createdBy?.name?.toLowerCase().includes(term) ||
      this.parseStatus(ticket.status).toLowerCase().includes(term)
    );
  }

  // Helper to handle both normal strings and any weird backend stringified JSON
  parseStatus(rawStatus: string): string {
    if (!rawStatus) return 'Open';
    try {
      if (rawStatus.trim().startsWith('{')) {
        return JSON.parse(rawStatus).status || 'Open';
      }
      return rawStatus;
    } catch {
      return rawStatus;
    }
  }

  getStatusClass(status: string): string {
    const cleanStatus = this.parseStatus(status).toLowerCase();
    if (cleanStatus === 'open') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (cleanStatus === 'inprogress') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (cleanStatus === 'resolved' || cleanStatus === 'completed') return 'bg-green-100 text-green-800 border-green-200';
    if (cleanStatus === 'closed') return 'bg-gray-200 text-gray-800 border-gray-300';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}