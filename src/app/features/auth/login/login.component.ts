// // import { Component, inject } from '@angular/core';
// // import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// // import { Router } from '@angular/router';
// // import { AuthService } from '../../../core/services/auth.service';
// // import { CommonModule } from '@angular/common';

// // @Component({
// //   selector: 'app-login',
// //   standalone: true,
// //   imports: [CommonModule, ReactiveFormsModule],
// //   templateUrl: './login.component.html',
// //   styleUrls: ['./login.component.scss']
// // })
// // export class LoginComponent {
// //   private fb = inject(FormBuilder);
// //   private authService = inject(AuthService);
// //   private router = inject(Router);

// //   loginForm: FormGroup = this.fb.group({
// //     email: ['', [Validators.required, Validators.email]],
// //     password: ['', [Validators.required, Validators.minLength(6)]]
// //   });

// //   errorMessage: string = '';

// //   onSubmit() {
// //     console.log('1. Form Submitted', this.loginForm.value);
// //     if (this.loginForm.valid) {
      
// //       this.authService.login(this.loginForm.value).subscribe({
// //         next: (user) => {
// //           console.log('2. Login Success:', user);
// //           console.log('signal role from user data:',user.role)
// //           // Check role and redirect
// //           const clean = (str: string) => str.replace(/['"]+/g, '').trim().toLowerCase();
// //   const role = clean(user.role);
// //           console.log('trimmed role:', role);
// //           if (role === "admin") {
// //             this.router.navigate(['/admin/dashboard']);
// //           } else {
// //             this.router.navigate(['/employee/dashboard']);
// //           }
// //         },
// //         error: (err) => {
// //           this.errorMessage = 'Invalid email or password. Please try again.';
// //         }
// //       });
// //     }
// //   }
// // }

// import { Component, inject, ChangeDetectorRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from '../../../core/services/auth.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './login.component.html'
//   // Note: We removed the styleUrls array because we are using Tailwind!
// })
// export class LoginComponent {
//   private fb = inject(FormBuilder);
//   private authService = inject(AuthService);
//   private router = inject(Router);
//   private cdr = inject(ChangeDetectorRef);

//   isLoginMode = true;
//   isLoading = false;
//   errorMessage = '';
//   successMessage = '';

//   // Single form for both modes
//   authForm: FormGroup = this.fb.group({
//     email: ['', [Validators.required, Validators.email]],
//     password: ['', [Validators.required, Validators.minLength(6)]],
//     name: [''], // Only required for registration
//     roleId: [2] // Default to Employee (Role ID: 2)
//   });

//   // Toggles between Login and Register views
//   toggleMode() {
//     this.isLoginMode = !this.isLoginMode;
//     this.errorMessage = '';
//     this.successMessage = '';
//     this.authForm.reset({ roleId: 2 }); // Reset but keep Employee as default
    
//     // Dynamically update validators based on mode
//     if (!this.isLoginMode) {
//       this.authForm.get('name')?.setValidators([Validators.required, Validators.minLength(2)]);
//     } else {
//       this.authForm.get('name')?.clearValidators();
//     }
//     this.authForm.get('name')?.updateValueAndValidity();
//   }

//   onSubmit() {
//     if (this.authForm.invalid) {
//       this.authForm.markAllAsTouched();
//       return;
//     }

//     this.isLoading = true;
//     this.errorMessage = '';
//     this.successMessage = '';

//     if (this.isLoginMode) {
//       // --- LOGIN LOGIC ---
//       const { email, password } = this.authForm.value;
//       this.authService.login({ email, password }).subscribe({
//         next: (user) => {
//           this.isLoading = false;
//           this.cdr.detectChanges();
//           // Clean the role string and redirect
//           const role = user.role.replace(/['"]+/g, '').trim().toLowerCase();
//           if (role === 'admin') {
//             this.router.navigate(['/admin/dashboard']);
//           } else {
//             this.router.navigate(['/employee/dashboard']);
//           }
//         },
//         error: (err) => {
//           this.isLoading = false;
//           this.errorMessage = 'Invalid email or password. Please try again.';
//         }
//       });
//     } 
//   }
// }



import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';

  // Strictly Login Fields Only
  authForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.authForm.value).subscribe({
      next: (user) => {
        this.isLoading = false;
        const role = user.role.replace(/['"]+/g, '').trim().toLowerCase();
        if (role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/employee/dashboard']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Invalid email or password. Please try again.';
      }
    });
  }
}