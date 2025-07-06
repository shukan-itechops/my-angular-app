import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { User } from '../../interface/interface';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UserDialog } from '../user-dialog/user-dialog';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserList {
  users: User[] = [];
  loading = true;
  error = '';
  dialog = inject(MatDialog);
  currentUserId: string | null = null;
  userRole: string | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.currentUserId = this.authService.getUserId();
    this.userRole = this.authService.getUserRole();
    this.authService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load users';
        this.loading = false;
      }
    });
  }

  editUser(user: User) {
    const dialogRef = this.dialog.open(UserDialog, {
      width: '400px',
      data: user  // 👈 Pass the selected user object
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers(); // 🔁 Refresh the user list
      }
    });
  }

  deleteUser(user: User) {
    Swal.fire({
      title: `Delete ${user.username}?`,
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      didOpen: () => {
        const confirmBtn = Swal.getConfirmButton();
        const cancelBtn = Swal.getCancelButton();
        if (confirmBtn) confirmBtn.style.backgroundColor = '#d33';
        if (cancelBtn) cancelBtn.style.backgroundColor = '#3085d6';
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.deleteUser(user.id!).subscribe({
          next: (res) => {
            Swal.fire({
              title: 'Deleted!',
              text: `${res.username} has been deleted successfully.`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadUsers();
          },
          error: (err) => {
            if (err.status === 404) {
              Swal.fire('Not Found', 'User not found or already deleted.', 'error');
            } else {
              Swal.fire('Error', 'Failed to delete user. Please try again.', 'error');
            }
          }
        });
      }
    });
  }

  onRoleChange(user: User) {
    if (!user.id) return;

    const updatedUser: User = {
      ...user,
      password: undefined
    };

    this.authService.updateUser(user.id, updatedUser).subscribe({
      next: () => {
        Swal.fire({
          title: 'Success',
          text: `Role updated to ${user.role}`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: () => {
        Swal.fire('Error', 'Failed to update role.', 'error');
      }
    });
  }
}
