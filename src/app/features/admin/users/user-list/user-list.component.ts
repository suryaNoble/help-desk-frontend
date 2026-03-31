import { Component, inject, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  isLoading = true;
  searchTerm = '';

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.allUsers = data;
        this.filteredUsers = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterUsers() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredUsers = this.allUsers;
      return;
    }

    this.filteredUsers = this.allUsers.filter(user => 
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.role?.name?.toLowerCase().includes(term) ||
      user.id.toString().includes(term)
    );
  }

  getRoleBadgeClass(roleName: string): string {
    const role = roleName?.toLowerCase() || '';
    if (role === 'admin') return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  }
}