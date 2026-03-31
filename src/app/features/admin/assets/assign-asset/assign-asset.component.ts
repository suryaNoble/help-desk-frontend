import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AssetService } from '../../../../core/services/asset.service';
import { UserService } from '../../../../core/services/user.service';
import { Asset } from '../../../../core/models/asset.model';

@Component({
  selector: 'app-assign-asset',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './assign-asset.component.html'
})
export class AssignAssetComponent implements OnInit {
  private fb = inject(FormBuilder);
  private assetService = inject(AssetService);
  private userService = inject(UserService);
  private router = inject(Router);

  assignForm!: FormGroup;
  users: any[] = [];
  availableAssets: Asset[] = [];
  
  isSubmitting = false;
  successMessage = '';

  ngOnInit() {
    // Initialize the form
    this.assignForm = this.fb.group({
      userId: ['', Validators.required],
      assetId: ['', Validators.required]
    });

    this.loadData();
  }

  loadData() {
    // 1. Load Users
    this.userService.getAllUsers().subscribe(res => {
      this.users = res;
    });

    // 2. Load Assets and filter only the 'Available' ones
    this.assetService.getAvailableAssets().subscribe(res => {
      this.availableAssets = res.filter(a => a.status?.toLowerCase() === 'available');
    });
  }

  onSubmit() {
    if (this.assignForm.invalid) return;

    this.isSubmitting = true;
    const { assetId, userId } = this.assignForm.value;

    this.assetService.assignAsset(assetId, userId).subscribe({
      next: (res) => {
        this.successMessage = res.message || 'Asset successfully assigned!';
        this.isSubmitting = false;
        this.assignForm.reset();
        
        // Reload data to remove the assigned asset from the dropdown
        this.loadData();
        
        // Optional: Route back to dashboard after 2 seconds
        // setTimeout(() => this.router.navigate(['/admin/dashboard']), 2000);
      },
      error: (err) => {
        console.error('Failed to assign asset', err);
        alert('Failed to assign asset. Check console for details.');
        this.isSubmitting = false;
      }
    });
  }
}