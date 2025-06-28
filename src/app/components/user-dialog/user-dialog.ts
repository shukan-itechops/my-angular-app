import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interface/interface';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-user-dialog',
  imports: [ReactiveFormsModule, FormsModule, MatInputModule, MatButtonModule, MatSnackBarModule, MatDialogModule,MatSlideToggleModule],
  templateUrl: './user-dialog.html',
  styleUrl: './user-dialog.scss'
})
export class UserDialog {

  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UserDialog>);
  private data = inject(MAT_DIALOG_DATA); // Inject passed user data
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  userForm = this.formBuilder.group({
    id: [''],
    userName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [''], // Optional
    isActive: [false], // New toggle field
    IsButterMilkEnable: [false] // New toggle field
  });

  constructor() {
    if (this.data) {
      debugger
      this.userForm.patchValue({
        id: this.data.id,
        userName: this.data.username,
        email: this.data.email,
        isActive: this.data.isActive,
        IsButterMilkEnable: this.data.isButterMilkEnable
      });
    }
  }

  save() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;

      const updatedUser: User = {
        id: formValue.id ?? '',
        username: formValue.userName ?? '',
        email: formValue.email ?? '',
        password: formValue.password || undefined, // only include if set
        isActive: formValue.isActive ?? false,
        isButterMilkEnable: formValue.IsButterMilkEnable ?? false
      };

      this.authService.updateUser(updatedUser.id!, updatedUser).subscribe({
        next: () => {
          this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true); // Let parent refresh list
        },
        error: (err) => {
          this.snackBar.open('Failed to update user: ' + (err.error || err.message), 'Close', { duration: 3000 });
        }
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
