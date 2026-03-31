import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../../../core/services/websocket.service';

@Component({
  selector: 'app-live-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="wsService.latestNotification() as message" 
         class="fixed top-20 right-6 z-[9999] animate-fade-in-down">
      <div class="bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-start gap-4 max-w-sm border border-gray-700">
        <div class="bg-blue-500/20 p-2 rounded-lg text-blue-400">
          <svg class="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
        </div>
        <div>
          <h4 class="font-bold text-sm text-gray-100 mb-1">Ticket Update</h4>
          <p class="text-sm text-gray-300 leading-tight">{{ message }}</p>
        </div>
      </div>
    </div>
  `
})
export class LiveToastComponent {
  // Inject so the HTML can read the Signal directly
  wsService = inject(WebSocketService); 
}