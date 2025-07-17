import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingService } from '../../../core/services/loading.service';

// Custom Validator
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card glass">
        <div class="auth-header">
          <h2 class="auth-title">Create an Account</h2>
          <p class="auth-subtitle">Start your journey with ClaudeShop</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label for="first_name">First Name</label>
              <input type="text" id="first_name" formControlName="first_name" placeholder="Your first name">
              <div *ngIf="registerForm.get('first_name')?.invalid && (registerForm.get('first_name')?.dirty || registerForm.get('first_name')?.touched)" class="error-message">
                <span *ngIf="registerForm.get('first_name')?.errors?.['required']">First name is required.</span>
              </div>
            </div>
            <div class="form-group">
              <label for="last_name">Last Name</label>
              <input type="text" id="last_name" formControlName="last_name" placeholder="Your last name">
              <div *ngIf="registerForm.get('last_name')?.invalid && (registerForm.get('last_name')?.dirty || registerForm.get('last_name')?.touched)" class="error-message">
                <span *ngIf="registerForm.get('last_name')?.errors?.['required']">Last name is required.</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" formControlName="email" placeholder="you@example.com">
            <div *ngIf="registerForm.get('email')?.invalid && (registerForm.get('email')?.dirty || registerForm.get('email')?.touched)" class="error-message">
              <span *ngIf="registerForm.get('email')?.errors?.['required']">Email is required.</span>
              <span *ngIf="registerForm.get('email')?.errors?.['email']">Please enter a valid email.</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" formControlName="password" placeholder="••••••••">
            <div *ngIf="registerForm.get('password')?.invalid && (registerForm.get('password')?.dirty || registerForm.get('password')?.touched)" class="error-message">
              <span *ngIf="registerForm.get('password')?.errors?.['required']">Password is required.</span>
              <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters.</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" formControlName="confirmPassword" placeholder="••••••••">
            <div *ngIf="registerForm.get('confirmPassword')?.touched && registerForm.hasError('passwordMismatch')" class="error-message">
              <span>Passwords do not match.</span>
            </div>
          </div>

          <div *ngIf="errorMessage" class="error-message server-error">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="registerForm.invalid || isLoading">
            <span *ngIf="!isLoading">Create Account</span>
            <span *ngIf="isLoading" class="spinner"></span>
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/auth/login">Log in</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: var(--background-gradient); padding: 24px; }
    .auth-card { width: 100%; max-width: 480px; padding: 40px; }
    .auth-header { text-align: center; margin-bottom: 32px; }
    .auth-title { font-size: 28px; font-weight: 700; color: var(--text-primary); margin: 0 0 8px 0; }
    .auth-subtitle { color: var(--text-secondary); margin: 0; }
    .form-row { display: flex; gap: 16px; margin-bottom: 20px; }
    .form-row .form-group { flex: 1; margin-bottom: 0; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; font-size: 14px; font-weight: 500; color: var(--text-secondary); margin-bottom: 8px; }
    .form-group input { width: 100%; padding: 12px 16px; border-radius: 8px; border: 1px solid var(--glass-border); background-color: rgba(255, 255, 255, 0.1); color: var(--text-primary); font-size: 16px; transition: all 0.2s ease; }
    .form-group input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(189, 153, 162, 0.3); }
    .error-message { color: #e57373; font-size: 12px; margin-top: 6px; }
    .server-error { text-align: center; margin-bottom: 16px; background-color: rgba(229, 115, 115, 0.1); padding: 12px; border-radius: 8px; }
    .btn-block { width: 100%; padding: 14px; font-size: 16px; font-weight: 600; }
    .btn-primary[disabled] { background: var(--primary-light); cursor: not-allowed; opacity: 0.7; }
    .spinner { display: inline-block; width: 20px; height: 20px; border: 2px solid rgba(255, 255, 255, 0.5); border-radius: 50%; border-top-color: #fff; animation: spin 1s ease-in-out infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .auth-footer { text-align: center; margin-top: 24px; font-size: 14px; }
    .auth-footer p { color: var(--text-secondary); margin: 0; }
    .auth-footer a { color: var(--accent); text-decoration: none; font-weight: 500; }
    .auth-footer a:hover { text-decoration: underline; }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.loadingService.show();

    try {
      const { first_name, last_name, email, password } = this.registerForm.value;
      await this.authService.register({ first_name, last_name, email, password }).toPromise();
      this.router.navigate(['/auth/login']); // Redirect to login after successful registration
    } catch (error: any) {
      this.errorMessage = error.error?.message || 'An unexpected error occurred. Please try again.';
    } finally {
      this.isLoading = false;
      this.loadingService.hide();
    }
  }
}
