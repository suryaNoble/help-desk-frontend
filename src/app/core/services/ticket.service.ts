import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { Ticket } from '../models/ticket.model';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class TicketService {
  private api = inject(ApiService);
  private auth = inject(AuthService);
 private http = inject(HttpClient);
//   getMyTickets(searchTerm: string = '') {
//     const userId = this.auth.userId();
//     // We pass the search term as a query parameter
//     return this.api.get<Ticket[]>(`/tickets/user/${userId}?search=${searchTerm}`);
//   }

getMyTickets(searchTerm: string = ''): Observable<Ticket[]> {
    const userId = this.auth.userId(); // Dynamically gets '5' (or whatever the logged-in ID is)
    
    let params = new HttpParams();
    if (searchTerm) {
      // Matches a backend endpoint like: /tickets/user/5?search=Laptop
      params = params.set('search', searchTerm); 
    }

    // Note: ApiService already prefixes http://localhost:8080/api
    return this.api.get<Ticket[]>(`/tickets/user/${userId}`, params);
  }

  getAllTicketHistory(): Observable<any[]> {
    return this.api.get<any[]>('/tickets/all-history');
  }

  getAllTickets(): Observable<Ticket[]> {
  return this.api.get<Ticket[]>('/tickets'); 
}

// 2. Update the status when dragged
updateTicketStatus(ticketId: number, newStatus: string): Observable<any> {
  // Sending as an object to match your backend's expected JSON
  return this.api.put(`/tickets/${ticketId}/status`, { status: newStatus });
}

updateTicketStatusKanban(ticketId: number, status: string): Observable<any> {
    return this.http.patch(`http://localhost:8080/tickets/${ticketId}/status`, status, {
      headers: { 'Content-Type': 'text/plain' },
      responseType: 'text' // Prevent Angular from crashing trying to parse a plain string response
    });
  }
}

