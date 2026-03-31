import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-user.component.html'
})
export class CreateUserComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  isSubmitting = false;

  userForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    roleId: [2, Validators.required] // Default to Employee
  });

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    
    // Send data to backend: { name, email, password, roleId }
    this.userService.createUser(this.userForm.value).subscribe({
      next: () => {
        alert('User created successfully!');
        this.isSubmitting = false;
        this.router.navigate(['/admin/users']); // Go back to directory
      },
      error: (err) => {
        console.log('Error creating user', err);
        alert(err.error?.error || 'Failed to create user. Email might be in use.');
        this.isSubmitting = false;
      }
    });
  }
}