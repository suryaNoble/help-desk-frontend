// import { Component } from '@angular/core';

// @Component({
//     selector: 'app-employee-dashboard',
//   standalone: true,
//   template: `
//     <div class="p-6">
//       <h1 class="text-2xl font-bold">Employee Landing Page</h1>
//       <p>Welcome to the system management portal.</p>
//     </div>
//   `
// })
// export class EmployeeDashboardComponent {}






import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WebSocketService } from '../../../core/services/websocket.service';
import { AssetService } from '../../../core/services/asset.service';
import { TicketService } from '../../../core/services/ticket.service';
import { AuthService } from '../../../core/services/auth.service'; 
import { Asset } from '../../../core/models/asset.model';
import { Ticket } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-dashboard.component.html'
})
export class EmployeeDashboardComponent implements OnInit {
  private assetService = inject(AssetService);
  private ticketService = inject(TicketService);
  private authService = inject(AuthService); // Inject your auth service
  private cdr = inject(ChangeDetectorRef);
  private wsService = inject(WebSocketService);

  employeeName = ''; 
  activeTicketsCount = 0;
  assignedAssetsCount = 0;

  recentTickets: Ticket[] = [];
  myAssets: Asset[] = [];
  isLoading = true;

  ngOnInit() {
    // 1. Read from your Angular Signals!
    const userId = this.authService.userId(); 
    const currentUser = this.authService.currentUser();
    // 2. Safely grab the user's name from the signal, fallback to 'Employee'
    this.employeeName = currentUser?.name || 'Employee'; 

    if (userId) {
      this.wsService.connect(userId);
    }

    // 3. If we have a valid ID, fetch their specific data
    if (userId) {
      this.loadDashboardData(userId);
      this.isLoading = false;
      this.cdr.detectChanges();
    } else {
      this.isLoading = false;
      this.cdr.detectChanges();
      console.error('Could not find logged-in user ID');
    }
  }

  loadDashboardData(userId: number) {
    // 2. Fetch My Assets (This calls your GET /assets/user/{userId} endpoint)
    this.assetService.getMyAssets().subscribe({
      next: (assets) => {
        this.myAssets = assets;
        this.assignedAssetsCount = assets.length;
        this.cdr.detectChanges();


      },
      error: (err) => console.error('Failed to load assets', err)
    });

    // 3. Fetch My Tickets
    this.ticketService.getAllTickets().subscribe({
      next: (allTickets) => {
        // Filter tickets that belong strictly to this user
        const userTickets = allTickets.filter(t => t.createdBy?.id === userId);
        
        // Count tickets that are not resolved
        this.activeTicketsCount = userTickets.filter(
          t => t.status !== 'Resolved' && t.status !== 'Closed'
        ).length;

        // Sort by newest first and grab the top 3 for the "Recent" list
        this.recentTickets = userTickets
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);
          
        this.isLoading = false;
              this.cdr.detectChanges();

      },
      error: (err) => {
        console.error('Failed to load tickets', err);
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    const s = status?.toLowerCase() || '';
    if (s === 'open') return 'bg-blue-100 text-blue-800';
    if (s === 'inprogress') return 'bg-yellow-100 text-yellow-800';
    if (s === 'resolved') return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  }
}