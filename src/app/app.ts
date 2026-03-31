import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NetworkStatusComponent } from './shared/components/network-status/network-status.component';
import { LiveToastComponent } from './shared/components/live-toast/live-toast.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NetworkStatusComponent, LiveToastComponent],
  // templateUrl: './app.html',
  styleUrl: './app.scss',
  template: `

    <app-network-status></app-network-status>
    <app-live-toast></app-live-toast>
    <router-outlet></router-outlet>
  `
})
export class App {
  protected readonly title = signal('help-desk-frontend');
}
