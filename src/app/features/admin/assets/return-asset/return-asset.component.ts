// import { Component, inject, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { AssetService } from '../../../../core/services/asset.service';
// import { Asset } from '../../../../core/models/asset.model';

// @Component({
//   selector: 'app-return-asset',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './return-asset.component.html'
// })
// export class ReturnAssetComponent implements OnInit {
//   private assetService = inject(AssetService);
  
//   assignedAssets: Asset[] = [];
//   isLoading = true;

//   ngOnInit() {
//     this.loadAssignedAssets();
//   }

//   loadAssignedAssets() {
//     this.isLoading = true;
//     this.assetService.getAvailableAssets().subscribe((assets) => {
//       // Filter out assets that are NOT available (meaning they are assigned)
//       this.assignedAssets = assets.filter(a => a.status?.toLowerCase() !== 'available');
//       this.isLoading = false;
//     });
//   }

//   onReturn(asset: Asset) {
//     if (confirm(`Are you sure you want to return "${asset.name}" to inventory?`)) {
//       this.assetService.returnAsset(asset.id).subscribe({
//         next: (res) => {
//           alert(res.message || 'Asset returned successfully.');
//           this.loadAssignedAssets(); // Refresh the list
//         },
//         error: (err) => {
//           const errorMessage = err.error?.error || 'Failed to return asset.';
//           alert('Error: ' + errorMessage);
//         }
//       });
//     }
//   }
// }




import { Component, inject, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetService } from '../../../../core/services/asset.service';
import { Asset } from '../../../../core/models/asset.model';

@Component({
  selector: 'app-return-asset',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './return-asset.component.html'
})
export class ReturnAssetComponent implements OnInit {
  private assetService = inject(AssetService);
  private cdr = inject(ChangeDetectorRef);
  assignedAssets: Asset[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadAssignedAssets();
  }

  loadAssignedAssets() {
    this.isLoading = true;
    
    // Note: Assuming getAvailableAssets() maps to your GET /assets endpoint
    this.assetService.getAvailableAssets().subscribe({
      next: (assets) => {
        // FILTER: Only keep assets where the status is exactly 'Assigned'
        this.assignedAssets = assets.filter(asset => asset.status === 'Assigned');
        console.log("Assigned Assets Loaded in return asset component.ts:", this.assignedAssets);
        this.isLoading = false;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load assets:', err);
        alert('Failed to load assets from the server.');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Notice we now accept the 'id' directly as a number
  onReturn(assetId: number, assetName: string) {
    if (confirm(`Are you sure you want to return "${assetName}" to inventory?`)) {
      
      // Call the POST /assets/{id}/return endpoint
      this.assetService.returnAsset(assetId).subscribe({
        next: (res) => {
          // res.message matches your Spring Boot Map.of("message", "...")
          alert(res.message || 'Asset returned successfully.');
          
          // Refresh the table to remove the returned asset
          this.loadAssignedAssets(); 
        },
        error: (err) => {
          // err.error.error matches your Spring Boot Map.of("error", e.getMessage())
          const errorMessage = err.error?.error || 'Failed to return asset.';
          alert('Error: ' + errorMessage);
        }
      });
    }
  }
}