import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';

import { TicketService } from '../../../core/services/ticket.service';
import { Ticket } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './my-tickets.component.html'
})
export class MyTicketsComponent implements OnInit {
  private ticketService = inject(TicketService);
  
  searchControl = new FormControl('');
  tickets$!: Observable<Ticket[]>;

  ngOnInit() {
    this.tickets$ = this.searchControl.valueChanges.pipe(
      startWith(''), // Trigger initial load
      debounceTime(300), // Wait 300ms after keystrokes stop
      distinctUntilChanged(), // Don't trigger if the text is the same
      switchMap(term => this.ticketService.getMyTickets(term || '')) // Cancel pending requests and fetch new
    );
  }

  // Helper method to style status badges
  getStatusClass(status: string): string {
    const normalized = status?.toLowerCase() || '';
    if (normalized === 'open') return 'bg-blue-100 text-blue-800';
    if (normalized === 'inprogress') return 'bg-yellow-100 text-yellow-800';
    if (normalized === 'resolved') return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  }
}