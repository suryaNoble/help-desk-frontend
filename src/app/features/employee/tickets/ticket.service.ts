import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private http = inject(HttpClient);

  private baseUrl = 'http://localhost:8080/tickets';

  createTicket(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }
}