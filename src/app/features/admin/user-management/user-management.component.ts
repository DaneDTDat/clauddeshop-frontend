import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '@app/core/services/admin.service';
import { User, UserRole, UserListResponse } from '@app/core/models/user.model';
import { LoadingService } from '@app/core/services/loading.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  loading = false;
  
  // Search and filter
  searchTerm = '';
  selectedRole = '';
  selectedStatus = '';
  
  // Pagination
  pagination = {
    page: 1,
    limit: 10,
    total: 0
  };
  
  // Track updating users
  updatingUsers = new Set<number>();

  // Make Math available in template
  Math = Math;
  
  // Search debounce
  private searchTimeout: any;
  
  constructor(
    private adminService: AdminService,
    private loadingService: LoadingService
  ) {}
  
  ngOnInit(): void {
    this.loadUsers();
  }
  
  loadUsers(): void {
    this.loading = true;
    
    const params = {
      page: this.pagination.page,
      limit: this.pagination.limit,
      ...(this.searchTerm && { search: this.searchTerm }),
      ...(this.selectedRole && { role: this.selectedRole }),
      ...(this.selectedStatus && { status: this.selectedStatus })
    };
    
    this.adminService.getUsers(params).subscribe({
      next: (response: UserListResponse) => {
        this.users = response.users;
        this.pagination = response.pagination;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }
  
  onSearchChange(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.pagination.page = 1;
      this.loadUsers();
    }, 500);
  }
  
  onFilterChange(): void {
    this.pagination.page = 1;
    this.loadUsers();
  }
  
  refreshUsers(): void {
    this.loadUsers();
  }
  
  changePage(page: number): void {
    if (page >= 1 && page <= Math.ceil(this.pagination.total / this.pagination.limit)) {
      this.pagination.page = page;
      this.loadUsers();
    }
  }
  
  updateUserRole(user: User, event: any): void {
    const newRole = event.target.value;
    if (newRole === user.role) return;
    
    this.updatingUsers.add(user.id);
    
    this.adminService.updateUserRole(user.id, newRole).subscribe({
      next: (response) => {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = response.user;
        }
        this.updatingUsers.delete(user.id);
      },
      error: (error) => {
        console.error('Error updating user role:', error);
        // Reset the select to original value
        event.target.value = user.role;
        this.updatingUsers.delete(user.id);
      }
    });
  }
  
  toggleUserStatus(user: User): void {
    if (this.updatingUsers.has(user.id) || this.isCurrentUser(user.id)) return;
    this.updatingUsers.add(user.id);
    
    this.adminService.toggleUserStatus(user.id).subscribe({
      next: (response) => {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = response.user;
        }
        this.updatingUsers.delete(user.id);
      },
      error: (error) => {
        console.error('Error toggling user status:', error);
        this.updatingUsers.delete(user.id);
      }
    });
  }
  
  viewUserDetails(user: User): void {
    this.selectedUser = user;
  }
  
  closeModal(): void {
    this.selectedUser = null;
  }
  
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedRole = '';
    this.selectedStatus = '';
    this.pagination.page = 1;
    this.loadUsers();
  }
  
  getUserInitials(user: User): string {
    return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
  }
  
  totalPages(): number {
    return Math.ceil(this.pagination.total / this.pagination.limit);
  }

  isCurrentUser(userId: number): boolean {
    // This assumes you have a way to get the current user's ID.
    // Replace with your actual authentication service logic.
    // const currentUserId = this.authService.getCurrentUserId(); 
    const currentUserId = 1; // Placeholder
    return userId === currentUserId;
  }
}
