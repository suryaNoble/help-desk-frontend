// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-admin-layout',
//   imports: [],
//   templateUrl: './admin-layout.html',
//   styles: ``,
// })
// export class AdminLayout {}


import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="flex h-screen bg-gray-50">
      <app-sidebar [role]="'Admin'"></app-sidebar>
      
      <div class="flex-1 overflow-y-auto">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class AdminLayoutComponent {}