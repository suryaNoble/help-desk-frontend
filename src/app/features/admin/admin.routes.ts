// import { Routes } from '@angular/router';
// import { AdminDashboardComponent } from './dashboard/dashboard.component';

// export const ADMIN_ROUTES: Routes = [
//   { path: 'dashboard', component: AdminDashboardComponent },
//   { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
// ];

import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { AdminDashboardComponent } from './dashboard/dashboard.component';
import { AdminLayoutComponent } from '../../layout/admin-layout/admin-layout';
import { TicketHistoryComponent } from './tickets/ticket-history/ticket-history.component';
import { KanbanComponent } from './tickets/kanban/kanban.component';
import { AssignAssetComponent } from './assets/assign-asset/assign-asset.component';
import { ReturnAssetComponent } from './assets/return-asset/return-asset.component';
import { CreateAssetComponent } from './assets/create-asset/create-asset.component';
import { AssetListComponent } from './assets/asset-list/asset-list.component';
import { TicketListComponent } from './tickets/ticket-list/ticket-list.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { CreateUserComponent } from './users/create-user/create-user.component';

// --- Temporary Placeholder Components ---
@Component({ standalone: true, template: '<div class="p-8 text-xl">All Assets Page Building...</div>' })
class PlaceholderAssets {}

@Component({ standalone: true, template: '<div class="p-8 text-xl">Create Asset Page Building...</div>' })
class PlaceholderCreateAsset {}

@Component({ standalone: true, template: '<div class="p-8 text-xl">Assign Asset Page Building...</div>' })
class PlaceholderAssignAsset {}

@Component({ standalone: true, template: '<div class="p-8 text-xl">Return Asset Page Building...</div>' })
class PlaceholderReturnAsset {}

@Component({ standalone: true, template: '<div class="p-8 text-xl">All Tickets Page Building...</div>' })
class PlaceholderAllTickets {}

@Component({ standalone: true, template: '<div class="p-8 text-xl">Kanban Board Building...</div>' })
class PlaceholderKanban {}

@Component({ standalone: true, template: '<div class="p-8 text-xl">Ticket History Building...</div>' })
class PlaceholderHistory {}

@Component({ standalone: true, template: '<div class="p-8 text-xl">Users List Building...</div>' })
class PlaceholderUsers {}

@Component({ standalone: true, template: '<div class="p-8 text-xl">Audit Logs Building...</div>' })
class PlaceholderLogs {}
// ----------------------------------------

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent, // The parent wrapper
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      
      // Assets
      { path: 'assets', component: AssetListComponent },
      { path: 'assets/new', component: CreateAssetComponent },
{ path: 'assets/assign', component: AssignAssetComponent },      
{ path: 'assets/return', component: ReturnAssetComponent },
      // Tickets
      { path: 'tickets', component: TicketListComponent },
      { path: 'tickets/kanban', component: KanbanComponent },
      { path: 'tickets/history', component: TicketHistoryComponent },

      // System
      { path: 'users/new', component: CreateUserComponent },
      { path: 'users', component: UserListComponent },
      { path: 'audit-logs', component: AuditLogsComponent },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];