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
  isDarkMode = false;
  constructor(private auth: AuthService) {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.applyDarkMode(this.isDarkMode);
  }
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

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.applyDarkMode(this.isDarkMode);
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  private applyDarkMode(isDark: boolean) {
    const htmlEl = document.documentElement;
    htmlEl.classList.toggle('dark', isDark);
  }

}
