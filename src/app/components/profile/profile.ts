import { Component } from '@angular/core';
import { User } from '../../interface/interface';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  user: User | null = null;
  loading = true;
  error = '';

   constructor(private authService: AuthService) {}

    ngOnInit(): void {
    this.authService.getUserProfile().subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load profile';
        this.loading = false;
      }
    });
  }

}
