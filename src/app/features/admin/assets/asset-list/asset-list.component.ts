import { Component, inject, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Required for ngModel search
import { AssetService } from '../../../../core/services/asset.service';
import { Asset } from '../../../../core/models/asset.model';

@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './asset-list.component.html'
})
export class AssetListComponent implements OnInit {
  private assetService = inject(AssetService);
    private cdr = inject(ChangeDetectorRef);


  allAssets: Asset[] = [];
  filteredAssets: Asset[] = [];
  isLoading = true;
  searchTerm = '';

  ngOnInit() {
    this.loadAssets();
  }

  loadAssets() {
    this.isLoading = true;
    this.assetService.getAllAssets().subscribe({
      next: (data) => {
        this.allAssets = data;
        console.log('Assets loaded in asset-list.component.ts:', this.allAssets);
        this.filteredAssets = data; // Initialize the table with all data
        this.isLoading = false;
                this.cdr.detectChanges();

      },
      error: (err) => {
        console.error('Failed to load assets', err);
        this.isLoading = false;
                this.cdr.detectChanges();

      }
    });
  }

  // Instantly filters the table as the user types
  filterAssets() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredAssets = this.allAssets;
      return;
    }

    this.filteredAssets = this.allAssets.filter(asset => 
      asset.name?.toLowerCase().includes(term) ||
      asset.serialNumber?.toLowerCase().includes(term) ||
      asset.assignedTo?.name?.toLowerCase().includes(term) ||
      asset.status?.toLowerCase().includes(term)
    );
  }

  // Helper method for professional status badges
  getStatusBadge(status: string): string {
    const s = status?.toLowerCase() || '';
    if (s === 'available') return 'bg-green-100 text-green-800 border-green-200';
    if (s === 'assigned') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (s === 'inrepair' || s === 'in repair') return 'bg-red-100 text-red-800 border-red-200';
    if (s === 'retired') return 'bg-gray-200 text-gray-800 border-gray-300';
    return 'bg-gray-100 text-gray-800';
  }
}