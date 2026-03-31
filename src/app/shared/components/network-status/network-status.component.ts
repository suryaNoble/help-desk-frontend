import { Component, HostListener,inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-network-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOffline" 
         class="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] animate-fade-in-down">
      <div class="bg-red-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 font-medium text-sm">
        <svg class="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"></path>
        </svg>
        You are currently offline. Check your internet connection.
      </div>
    </div>

    <div *ngIf="showOnlineRestored" 
         class="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] animate-fade-in-down">
      <div class="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 font-medium text-sm transition-opacity duration-500">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Connection restored. You are back online!
      </div>
    </div>
  `
})
export class NetworkStatusComponent {

   private cdr = inject(ChangeDetectorRef);
  isOffline = !navigator.onLine; 
  showOnlineRestored = false;

  // This forces Angular to listen and automatically trigger HTML updates
  @HostListener('window:offline')
  onOffline() {
    this.isOffline = true;
    this.showOnlineRestored = false;
    this.cdr.detectChanges();
  }

  // Listens for the connection coming back
  @HostListener('window:online')
  onOnline() {
    this.isOffline = false;
    this.showOnlineRestored = true;
    this.cdr.detectChanges();
    
    // Auto-dismiss the success toast after 3.5 seconds
    setTimeout(() => {
      this.showOnlineRestored = false;
      this.cdr.detectChanges();
    }, 3500);
  }
}