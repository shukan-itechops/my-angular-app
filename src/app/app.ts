import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, Event as RouterEvent, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Navbar } from './components/navbar/navbar';
import { CommonModule } from '@angular/common';
import { Sidebar } from './components/sidebar/sidebar';
import { Loader } from './components/loader/loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, CommonModule, Sidebar, Loader],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'my-angular-app';

  loading = false;
  isAuthPage = false;
  initialAuthResolved = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loading = false;
        this.initialAuthResolved = true;
      }

      // Auth page check
      if (event instanceof NavigationEnd) {
        this.isAuthPage = ['/login', '/register', '/'].includes(event.urlAfterRedirects);
      }
    });
  }

}
