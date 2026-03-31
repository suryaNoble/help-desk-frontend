import { Injectable, signal } from '@angular/core';
import { Client } from '@stomp/stompjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private stompClient: Client | null = null;
  
  // Signals to trigger the UI updates instantly
  public latestNotification = signal<string | null>(null);
  public unreadCount = signal<number>(0);

  connect(userId: number) {
    if (this.stompClient) return; // Already connected

    this.stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws', // Matches Spring Boot endpoint
      reconnectDelay: 5000, // Auto-reconnect if the server restarts
      onConnect: () => {
        console.log('Connected to Real-Time WebSocket!');
        
        // Subscribe ONLY to this user's personal queue
        this.stompClient?.subscribe(`/queue/notifications/${userId}`, (message) => {
          
          // 1. Update the toast message
          this.latestNotification.set(message.body);
          
          // 2. Increment the unread badge count
          this.unreadCount.update(count => count + 1);
          
          // 3. Auto-hide the toast after 5 seconds
          setTimeout(() => {
            this.latestNotification.set(null);
          }, 5000);
        });
      }
    });

    this.stompClient.activate();
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
  }

  clearBadge() {
    this.unreadCount.set(0);
  }
}