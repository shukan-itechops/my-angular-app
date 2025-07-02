import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  isOpen = false;
  constructor(private auth: AuthService) { }
  logout() {
    this.auth.logout();
  }
  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  closeSidebarOnMobile() {
    if (window.innerWidth < 768) {
      this.isOpen = false;
    }
  }

}
