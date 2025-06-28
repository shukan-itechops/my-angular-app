import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { User } from '../../interface/interface';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UserDialog } from '../user-dialog/user-dialog';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserList {
  users: User[] = [];
  loading = true;
  error = '';
  dialog = inject(MatDialog);

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
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
    // confirm + delete logic
    if (confirm(`Are you sure to delete ${user.username}?`)) {
      console.log('Delete user', user);
      // this.userService.deleteUser(user.id).subscribe(...)
    }
  }


}
