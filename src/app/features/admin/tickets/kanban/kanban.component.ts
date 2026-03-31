import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../../../core/services/ticket.service';
import { Ticket } from '../../../../core/models/ticket.model';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kanban.component.html'
})
export class KanbanComponent implements OnInit {
  private ticketService = inject(TicketService);
  private cdr = inject(ChangeDetectorRef);
  openTickets: Ticket[] = [];
  inProgressTickets: Ticket[] = [];
  resolvedTickets: Ticket[] = [];
  
  isLoading = true;
  draggedTicket: Ticket | null = null;

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.isLoading = true;
    this.ticketService.getAllTickets().subscribe({
      next: (tickets) => {
        this.distributeTickets(tickets);
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

  // Sorts tickets into their correct columns
  distributeTickets(tickets: Ticket[]) {
    // Everything that isn't InProgress or Resolved gets dumped into Open (handling your test data)
    this.openTickets = tickets.filter(t => t.status !== 'InProgress' && t.status !== 'Resolved');
    this.inProgressTickets = tickets.filter(t => t.status === 'InProgress');
    this.resolvedTickets = tickets.filter(t => t.status === 'Resolved');
  }

  // --- DRAG AND DROP LOGIC ---

  onDragStart(ticket: Ticket) {
    this.draggedTicket = ticket;
  }

  onDragOver(event: DragEvent) {
    // You MUST prevent default behavior to allow dropping in HTML5
    event.preventDefault(); 
  }

  onDrop(event: DragEvent, newStatus: string) {
    event.preventDefault();
    
    if (!this.draggedTicket) return;
    if (this.draggedTicket.status === newStatus) return; // Didn't change columns

    // 1. Optimistic UI Update (Move it instantly on the screen)
    const oldStatus = this.draggedTicket.status;
    this.draggedTicket.status = newStatus;
    
    // Combine all arrays and redistribute to update the screen instantly
    const allTickets = [...this.openTickets, ...this.inProgressTickets, ...this.resolvedTickets];
    this.distributeTickets(allTickets);

    // 2. Update Database in the background
    const ticketId = this.draggedTicket.id;
    this.ticketService.updateTicketStatusKanban(ticketId, newStatus).subscribe({
      next: () => {
        console.log(`Ticket #${ticketId} moved to ${newStatus}`);
      },
      error: (err) => {
        console.error('Failed to move ticket', err);
        alert('Failed to save ticket status. Reverting change.');
        
        // Revert UI if DB fails
        const t = allTickets.find(t => t.id === ticketId);
        if (t) t.status = oldStatus;
        this.distributeTickets(allTickets);
      }
    });

    this.draggedTicket = null;
  }
}