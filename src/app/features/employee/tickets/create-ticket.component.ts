// import { Component, inject, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { AbstractControl, ValidationErrors } from '@angular/forms';
// import { Observable, of, delay, map, first } from 'rxjs';
// import { AuthService } from '../../../core/services/auth.service';
// import { TicketService } from './ticket.service';

// @Component({
//   selector: 'app-create-ticket',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './create-ticket.component.html',
//   styleUrls: ['./create-ticket.component.scss']
// })
// export class CreateTicketComponent implements OnInit {
//   private fb = inject(FormBuilder);
//   private auth = inject(AuthService);           
//   private ticketService = inject(TicketService);

//   ticketForm!: FormGroup;

//   ngOnInit() {
//     this.ticketForm = this.fb.group({
//       title: ['', [Validators.required, Validators.minLength(10)]],
//       description: ['', Validators.required],
//       category: ['Software', Validators.required],
//       priority: ['Medium', Validators.required],
//       // FormArray for dynamic "Steps to Reproduce"
// stepsToReproduce: this.fb.array([this.fb.control('', Validators.required)])    });

//     // Watch Category changes to inject "Asset ID" dynamically
//     this.ticketForm.get('category')?.valueChanges.subscribe(value => {
//       this.updateValidation(value);
//     });
//   }

//   // --- FormArray Logic ---
//   get steps() {
//     return this.ticketForm.get('stepsToReproduce') as FormArray;
//   }

//  addStep() {
//   this.steps.push(this.fb.control('', Validators.required));
// }

//   removeStep(index: number) {
//     this.steps.removeAt(index);
//   }

//   // --- Dynamic Validation Logic ---
//   private updateValidation(category: string) {
//   const assetIdControl = this.ticketForm.get('assetId');

//   if (category === 'Hardware') {
//     if (!assetIdControl) {
//       this.ticketForm.addControl(
//         'assetId',
//         this.fb.control('', 
//           [Validators.required], 
//           [this.validateAssetId.bind(this)]
//         )
//       );
//     }
//   } else {
//     if (assetIdControl) {
//       this.ticketForm.removeControl('assetId');
//     }
//   }
// }

//   // --- Async Validator (Simulates checking if Asset ID exists in DB) ---
//   validateAssetId(control: AbstractControl): Observable<ValidationErrors | null> {
//     const id = control.value;
//     return of(id).pipe(
//       delay(1000), // Simulate network lag
//       map(val => (val === '999' ? { assetNotFound: true } : null)), // "999" is our mock invalid ID
//         first()
//     );
//   }


//   onSubmit() {
//   if (this.ticketForm.valid) {
//     const formValue = this.ticketForm.value;

//     console.log("userdata id : ",this.auth.userId);
//     const payload = {
//       title: formValue.title,
//       description: formValue.description,
//       createdBy: this.auth.userId(), // 🔥 current user
//       assetId: formValue.assetId ? Number(formValue.assetId) : null
//     };

//     console.log('in create-ticket-componentFinal Payload:', payload);

//     this.ticketService.createTicket(payload).subscribe({
//       next: (res: any) => {
//         console.log('Ticket Created:', res);
//       },
//       error: (err: any) => {
//         console.error('Error:', err);
//       }
//     });
//   }
// }
// }

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay, map, first } from 'rxjs/operators';

import { AuthService } from '../../../core/services/auth.service';
import { TicketService } from './ticket.service';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-ticket.component.html'
})
export class CreateTicketComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);          
  private ticketService = inject(TicketService);
  private router = inject(Router);

  ticketForm!: FormGroup;
  isSubmitting = false;

  ngOnInit() {
    this.ticketForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', Validators.required],
      category: ['Software', Validators.required],
      priority: ['Medium', Validators.required], // Included for frontend UI, even if backend ignores it for now
      stepsToReproduce: this.fb.array([this.fb.control('', Validators.required)])
    });

    // Watch Category changes to inject "Asset ID" dynamically
    this.ticketForm.get('category')?.valueChanges.subscribe(value => {
      this.updateValidation(value);
    });
  }

  // --- FormArray Logic ---
  get steps() {
    return this.ticketForm.get('stepsToReproduce') as FormArray;
  }

  addStep() {
    this.steps.push(this.fb.control('', Validators.required));
  }

  removeStep(index: number) {
    if (this.steps.length > 1) {
      this.steps.removeAt(index);
    }
  }

  // --- Dynamic Validation Logic ---
  private updateValidation(category: string) {
    if (category === 'Hardware') {
      if (!this.ticketForm.contains('assetId')) {
        this.ticketForm.addControl(
          'assetId',
          this.fb.control('', [Validators.required], [this.validateAssetId.bind(this)])
        );
      }
    } else {
      if (this.ticketForm.contains('assetId')) {
        this.ticketForm.removeControl('assetId');
      }
    }
  }

  // --- Async Validator (Simulates checking if Asset ID exists in DB) ---
  validateAssetId(control: AbstractControl): Observable<ValidationErrors | null> {
    const id = control.value;
    if (!id) return of(null);
    return of(id).pipe(
      delay(800), // Simulate network lag
      map(val => (val === '999' ? { assetNotFound: true } : null)), // "999" is our mock invalid ID
      first()
    );
  }

  onSubmit() {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.ticketForm.value;

    // 1. Format the description to include the steps to reproduce
    let finalDescription = formValue.description;
    
    // Only append if steps exist and the first one isn't empty
    if (formValue.stepsToReproduce && formValue.stepsToReproduce.length > 0 && formValue.stepsToReproduce[0].trim() !== '') {
        finalDescription += '\n\nSteps to Reproduce:\n';
        formValue.stepsToReproduce.forEach((step: string, index: number) => {
            finalDescription += `${index + 1}. ${step}\n`;
        });
    }

    // 2. Build the Payload matching your Spring Boot TicketRequestDTO
    const payload = {
      title: formValue.title,
      description: finalDescription,
      createdBy: this.auth.userId(), // Sends the current logged-in User ID
      assetId: formValue.assetId ? Number(formValue.assetId) : null
    };

    // 3. Send to Backend
    this.ticketService.createTicket(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        // Navigate back to employee dashboard instantly!
        this.router.navigate(['/employee/dashboard']); 
      },
      error: (err: any) => {
        console.error('Error submitting ticket:', err);
        this.isSubmitting = false;
        alert('Failed to submit ticket. Please check your connection.');
      }
    });
  }
}