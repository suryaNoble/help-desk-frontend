import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import Chart from 'chart.js/auto'; // Imports the entire Chart.js library

import { DashboardService } from '../../../core/services/dashboard.service';
import { AssetService } from '../../../core/services/asset.service';
import { TicketService } from '../../../core/services/ticket.service';
import { DashboardStats } from '../../../core/models/dashboard-stats.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private assetService = inject(AssetService);
  private ticketService = inject(TicketService);
  private cdr = inject(ChangeDetectorRef);

  stats: DashboardStats | null = null;
  isLoading = true;

  // Store raw data for charts
  rawAssets: any[] = [];
  rawTickets: any[] = [];

  // Chart instances
  pieChart: any;
  barChart: any;

  ngOnInit() {
    
    // Fetch Stats, Assets, and Tickets all at the same time
    forkJoin({
      stats: this.dashboardService.getDashboardStats(),
      assets: this.assetService.getAllAssets(),
      tickets: this.ticketService.getAllTickets()
    }).subscribe({
      next: (data) => {
        this.stats = data.stats;
        this.rawAssets = data.assets;
        this.rawTickets = data.tickets;
        
        this.isLoading = false;
        this.cdr.detectChanges();

        // Initialize charts after the view renders (setTimeout ensures the *ngIf DOM is ready)
        setTimeout(() => {
          this.initCategoryPieChart();
          this.initResolvedTicketsBarChart();
        }, 0);
      },
      error: (err) => {
        console.error('Failed to load dashboard data', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // --- Calculations for Existing Visualizations ---
  get totalAssets(): number {
    if (!this.stats) return 0;
    return this.stats.assignedAssets + this.stats.availableAssets;
  }

  get assetUtilizationPercentage(): number {
    if (this.totalAssets === 0) return 0;
    return Math.round((this.stats!.assignedAssets / this.totalAssets) * 100);
  }

  get urgentTicketPercentage(): number {
    if (!this.stats || this.stats.openTickets === 0) return 0;
    return Math.round((this.stats.urgentTickets / this.stats.openTickets) * 100);
  }

  // --- NEW: Chart.js Initialization ---

  initCategoryPieChart() {
    // Process Data: Count assets by category
    const categoryCounts: { [key: string]: number } = {};
    this.rawAssets.forEach(asset => {
      const catName = asset.category?.name || 'Uncategorized';
      categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
    });

    const canvas = document.getElementById('categoryPieChart') as HTMLCanvasElement;
    if (!canvas) return;

    this.pieChart = new Chart(canvas, {
      type: 'doughnut', // 'doughnut' looks slightly more modern than 'pie', but you can change this to 'pie'
      data: {
        labels: Object.keys(categoryCounts),
        datasets: [{
          data: Object.values(categoryCounts),
          backgroundColor: [
            '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280'
          ],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { usePointStyle: true, boxWidth: 8 } }
        }
      }
    });
  }

  initResolvedTicketsBarChart() {
    // Process Data: Get the last 7 days
    const last7Days: string[] = [];
    const countsMap: { [key: string]: number } = {};
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      last7Days.push(dateString);
      countsMap[dateString] = 0; // Initialize with 0
    }

    // Count resolved tickets matching those days
    this.rawTickets.forEach(ticket => {
      if (ticket.status?.toLowerCase() === 'resolved' && ticket.createdAt) {
        const ticketDate = new Date(ticket.createdAt).toISOString().split('T')[0];
        if (countsMap[ticketDate] !== undefined) {
          countsMap[ticketDate]++;
        }
      }
    });

    // Format labels nicely for the chart (e.g., "Mon 24")
    const displayLabels = last7Days.map(dateStr => {
      const d = new Date(dateStr);
      return `${d.toLocaleDateString('en-US', { weekday: 'short' })} ${d.getDate()}`;
    });

    const canvas = document.getElementById('resolvedBarChart') as HTMLCanvasElement;
    if (!canvas) return;

    this.barChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: displayLabels,
        datasets: [{
          label: 'Resolved Tickets',
          data: Object.values(countsMap),
          backgroundColor: '#10B981', // Tailwind Emerald 500
          borderRadius: 4 // Rounded corners on bars
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false } // Hide legend since we only have one dataset
        },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } }, // Force whole numbers
          x: { grid: { display: false } }
        }
      }
    });
  }
}