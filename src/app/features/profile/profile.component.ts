import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoadingService } from '../../core/services/loading.service';
import { User, UserRole } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';
import { OrderService } from '../../core/services/order.service';
import { Order, OrderStatus } from '../../core/models/order.model';
import { Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const newPassword = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');

  if (newPassword?.value && confirmPassword?.value && newPassword.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }

  return null;
};

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  profileForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  accountStats = { shops: 0, products: 0, revenue: 0 };
  customerStats = { totalOrders: 0, pending: 0, completed: 0 };
  recentOrders$!: Observable<Order[]>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private orderService: OrderService,
    public loadingService: LoadingService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      currentPassword: [''],
      newPassword: [''],
      confirmPassword: ['']
    }, { validators: passwordMatchValidator });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
      if (user) {
        this.populateForm(user);

        if (this.isCustomer) {
          this.loadCustomerData();
        } else {
          this.loadAccountStats();
        }
      }
    });
  }

  get isCustomer(): boolean {
    return this.currentUser?.role === UserRole.CUSTOMER;
  }

  loadCustomerData(): void {
    this.recentOrders$ = this.orderService.getOrders().pipe(
      map((orders: Order[]) => {
        this.customerStats.totalOrders = orders.length;
        this.customerStats.pending = orders.filter((o: Order) => o.status === OrderStatus.Pending).length;
        this.customerStats.completed = orders.filter((o: Order) => o.status === OrderStatus.Delivered || o.status === OrderStatus.Shipped).length;
        return orders.sort((a: Order, b: Order) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
      })
    );
  }

  private populateForm(user: User): void {
    this.profileForm.patchValue({
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email
    });
  }

  getUserInitials(): string {
    if (!this.currentUser) return 'U';
    const firstName = this.currentUser.first_name || '';
    const lastName = this.currentUser.last_name || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  getMemberSince(): string {
    if (!this.currentUser?.created_at) return 'N/A';
    const date = new Date(this.currentUser.created_at);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  async onSubmit(): Promise<void> {
    if (this.profileForm.invalid) {
      return;
    }

    this.loadingService.show();
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await this.updateProfileData();
      await this.updatePasswordIfNeeded();

      this.successMessage = 'Profile updated successfully!';
      setTimeout(() => this.successMessage = '', 3000);
    } catch (error: any) {
      this.errorMessage = error.message || 'Failed to update profile. Please try again.';
    } finally {
      this.loadingService.hide();
    }
  }

  private async updateProfileData(): Promise<void> {
    const { firstName, lastName } = this.profileForm.value;
    if (this.profileForm.get('firstName')?.dirty || this.profileForm.get('lastName')?.dirty) {
      await firstValueFrom(this.authService.updateProfile({
        first_name: firstName,
        last_name: lastName
      }));
    }
  }

  private async updatePasswordIfNeeded(): Promise<void> {
    const { currentPassword, newPassword } = this.profileForm.value;
    if (currentPassword && newPassword) {
      await firstValueFrom(this.authService.changePassword({ current_password: currentPassword, new_password: newPassword }));
      this.profileForm.patchValue({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      this.profileForm.get('currentPassword')?.markAsPristine();
      this.profileForm.get('newPassword')?.markAsPristine();
      this.profileForm.get('confirmPassword')?.markAsPristine();
    }
  }

  private async loadAccountStats(): Promise<void> {
    try {
      // This would fetch from a real UserService which in turn calls the backend API
      this.accountStats = await this.userService.getAccountStats();
    } catch (error) {
      console.error('Error loading account stats:', error);
      this.errorMessage = 'Could not load account statistics.';
    }
  }
}
