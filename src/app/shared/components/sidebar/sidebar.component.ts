// import { Component, Input, inject } from '@angular/core';
// import { RouterLink, RouterLinkActive } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../../../core/services/auth.service';

// @Component({
//   selector: 'app-sidebar',
//   standalone: true,
//   imports: [CommonModule, RouterLink, RouterLinkActive],
//   template: `
//     <nav class="bg-gray-900 text-white w-64 min-h-screen flex flex-col transition-all duration-300">
//       <div class="p-6 text-center border-b border-gray-800">
//         <h2 class="text-2xl font-bold tracking-wider text-blue-400">HelpDesk IT</h2>
//         <p class="text-xs text-gray-400 mt-1">Admin Portal</p>
//       </div>
      
//       <div class="flex-1 overflow-y-auto py-4">
//         <ul class="space-y-1">
//           <li>
//             <a routerLink="/admin/dashboard" routerLinkActive="bg-blue-600 border-l-4 border-blue-400" class="block py-3 px-6 hover:bg-gray-800 transition">
//               Welcome / Dashboard
//             </a>
//           </li>

//           <li class="pt-4 pb-2 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Asset Management</li>
//           <li><a routerLink="/admin/assets" routerLinkActive="bg-blue-600 border-l-4 border-blue-400" class="block py-2 px-6 pl-8 hover:bg-gray-800 text-sm transition">All Assets</a></li>
//           <li><a routerLink="/admin/assets/new" routerLinkActive="bg-blue-600 border-l-4 border-blue-400" class="block py-2 px-6 pl-8 hover:bg-gray-800 text-sm transition">Create Asset</a></li>
//           <li><a routerLink="/admin/assets/assign" routerLinkActive="bg-blue-600 border-l-4 border-blue-400" class="block py-2 px-6 pl-8 hover:bg-gray-800 text-sm transition">Assign Asset</a></li>
//           <li><a routerLink="/admin/assets/return" routerLinkActive="bg-blue-600 border-l-4 border-blue-400" class="block py-2 px-6 pl-8 hover:bg-gray-800 text-sm transition">Return Asset</a></li>

//           <li class="pt-4 pb-2 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket Processing</li>
//           <li><a routerLink="/admin/tickets" routerLinkActive="bg-blue-600 border-l-4 border-blue-400" class="block py-2 px-6 pl-8 hover:bg-gray-800 text-sm transition">All Tickets</a></li>
//           <li><a routerLink="/admin/tickets/kanban" routerLinkActive="bg-blue-600 border-l-4 border-blue-400" class="block py-2 px-6 pl-8 hover:bg-gray-800 text-sm transition">Change Ticket Status</a></li>
//           <li><a routerLink="/admin/tickets/history" routerLinkActive="bg-blue-600 border-l-4 border-blue-400" class="block py-2 px-6 pl-8 hover:bg-gray-800 text-sm transition">Ticket History</a></li>

//           <li class="pt-4 pb-2 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">System & Logs</li>
//           <li><a routerLink="/admin/users" routerLinkActive="bg-blue-600 border-l-4 border-blue-400" class="block py-2 px-6 pl-8 hover:bg-gray-800 text-sm transition">User Directory</a></li>
//           <li><a routerLink="/admin/audit-logs" routerLinkActive="bg-blue-600 border-l-4 border-blue-400" class="block py-2 px-6 pl-8 hover:bg-gray-800 text-sm transition">Audit Logs</a></li>
//         </ul>
//       </div>

//       <div class="p-4 border-t border-gray-800">
//         <button (click)="logout()" class="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition">
//           Logout
//         </button>
//       </div>
//     </nav>
//   `
// })
// export class SidebarComponent {
//   @Input() role: string = '';
//   private authService = inject(AuthService);

//   logout() {
//     this.authService.logout();
//   }
// }







import { Component, Input, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-gray-900 text-white w-64 min-h-screen flex flex-col">
  <div class="p-6 text-center border-b border-gray-800">
    <h2 class="text-2xl font-bold text-blue-400">HelpDesk IT</h2>
    <p class="text-xs text-gray-400 mt-1">{{ role }} Portal</p>
  </div>

  <div class="flex-1 overflow-y-auto py-4">
    <ul class="space-y-1">

      <!-- Dashboard -->
      <li>
        <a [routerLink]="['/', role.toLowerCase(), 'dashboard']"
           routerLinkActive="bg-blue-600 border-l-4 border-blue-400"
           class="block py-3 px-6 hover:bg-gray-800">
          Dashboard
        </a>
      </li>

      <!-- ADMIN -->
      <ng-container *ngIf="role?.toLowerCase() === 'admin'">

        <li class="px-6 text-xs text-gray-500 mt-4">Asset Management</li>

        <li><a routerLink="/admin/assets" routerLinkActive="bg-blue-600" class="block py-2 px-8">All Assets</a></li>
        <li><a routerLink="/admin/assets/new" routerLinkActive="bg-blue-600" class="block py-2 px-8">Create Asset</a></li>
        <li><a routerLink="/admin/assets/assign" routerLinkActive="bg-blue-600" class="block py-2 px-8">Assign Asset</a></li>
        <li><a routerLink="/admin/assets/return" routerLinkActive="bg-blue-600" class="block py-2 px-8">Return Asset</a></li>

        <li class="px-6 text-xs text-gray-500 mt-4">Tickets</li>

        <li><a routerLink="/admin/tickets" routerLinkActive="bg-blue-600" class="block py-2 px-8">All Tickets</a></li>
        <li><a routerLink="/admin/tickets/kanban" routerLinkActive="bg-blue-600" class="block py-2 px-8">Kanban Board</a></li>
        <li><a routerLink="/admin/tickets/history" routerLinkActive="bg-blue-600" class="block py-2 px-8">Ticket History</a></li>

        <li class="px-6 text-xs text-gray-500 mt-4">System</li>

        <li><a routerLink="/admin/users" routerLinkActive="bg-blue-600" class="block py-2 px-8">Users</a></li>
        <li><a routerLink="/admin/users/new" routerLinkActive="bg-blue-600" class="block py-2 px-8">Create User</a></li>
        <li><a routerLink="/admin/audit-logs" routerLinkActive="bg-blue-600" class="block py-2 px-8">Audit Logs</a></li>

      </ng-container>

      <!-- EMPLOYEE -->
      <ng-container *ngIf="role?.toLowerCase() === 'employee'">

        <li class="px-6 text-xs text-gray-500 mt-4">My Support</li>

        <li><a routerLink="/employee/tickets" routerLinkActive="bg-blue-600" class="block py-2 px-8">My Tickets</a></li>
        <li><a routerLink="/employee/tickets/new" routerLinkActive="bg-blue-600" class="block py-2 px-8">Raise Ticket</a></li>

        <li class="px-6 text-xs text-gray-500 mt-4">My Equipment</li>

        <li><a routerLink="/employee/assets" routerLinkActive="bg-blue-600" class="block py-2 px-8">My Assets</a></li>

      </ng-container>

    </ul>
  </div>

  <div class="p-4 border-t border-gray-800">
    <button (click)="logout()" class="w-full bg-red-600 py-2 rounded">
      Logout
    </button>
  </div>
</nav>
  `
})
export class SidebarComponent {
  @Input() role: string = '';
  private authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}