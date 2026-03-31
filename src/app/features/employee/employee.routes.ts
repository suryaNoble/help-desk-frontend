import { Routes } from '@angular/router';
import { EmployeeDashboardComponent } from './dashboard/employee-dashboard.component';
import { CreateTicketComponent } from './tickets/create-ticket.component';
import { MyTicketsComponent } from './tickets/my-tickets.component';
import { MyAssetsComponent } from './assets/my-assets.component'; // Import here
import { EmployeeLayoutComponent } from '../../layout/employee-layout/employee-layout.component';

export const EMPLOYEE_ROUTES: Routes = [
  {
    path: '',
    component: EmployeeLayoutComponent, // The parent wrapper
    children: [
      { path: 'dashboard', component: EmployeeDashboardComponent },
      { path: 'tickets', component: MyTicketsComponent },
      { path: 'tickets/new', component: CreateTicketComponent },
      { path: 'assets', component: MyAssetsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];