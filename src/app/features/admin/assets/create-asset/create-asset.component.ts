import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AssetService } from '../../../../core/services/asset.service';

@Component({
  selector: 'app-create-asset',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-asset.component.html'
})
export class CreateAssetComponent implements OnInit {
  private fb = inject(FormBuilder);
  private assetService = inject(AssetService);
  private router = inject(Router);

  assetForm!: FormGroup;
  categories: any[] = [];
  isSubmitting = false;

  ngOnInit() {
    // Initialize the form
    this.assetForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      serialNumber: ['', Validators.required],
      categoryId: ['', Validators.required],
      status: ['Available', Validators.required] // Default to Available
    });

    // Fetch categories for the dropdown
    this.assetService.getCategories().subscribe({
      next: (res) => this.categories = res,
      error: (err) => console.error('Could not load categories', err)
    });
  }

  onSubmit() {
    if (this.assetForm.invalid) {
      this.assetForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValues = this.assetForm.value;

    // Format the payload exactly how your Spring Boot Asset.java expects it!
    const payload = {
      name: formValues.name,
      serialNumber: formValues.serialNumber,
      status: formValues.status,
      category: {
        id: Number(formValues.categoryId) // Maps to the Category object
      }
      // assignedTo is left null automatically for new assets
    };

    this.assetService.createAsset(payload).subscribe({
      next: () => {
        alert('Asset created successfully!');
        this.isSubmitting = false;
        this.router.navigate(['/admin/assets']); // Route to the "All Assets" list
      },
      error: (err) => {
        console.error('Failed to create asset:', err);
        alert('Failed to create asset. Check console for details.');
        this.isSubmitting = false;
      }
    });
  }
}