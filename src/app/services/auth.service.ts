import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { User, UserLoginDto, UserRegisterDto } from '../interface/interface';
import { delay, Observable, of } from 'rxjs';

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) { }

  login(credentials: UserLoginDto) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<{ token: string }>(this.API_URL + "/auth/login", credentials, { headers });
  }

  register(data: UserRegisterDto) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.API_URL + "/Auth/register", data, { headers });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/auth/getAllUsers`);
  }

  updateUser(id: string, data: User) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.API_URL}/auth/${id}`, data, { headers });
  }

  deleteUser(id: string) {
    return this.http.delete<{ username: string }>(`${this.API_URL}/auth/${id}`);
  }


  getUserProfile(): Observable<User | null> {
    const userId = this.getUserId();
    if (!userId) {
      return new Observable<User | null>(observer => {
        observer.next(null);
        observer.complete();
      });
    }
    return this.http.get<User>(`${this.API_URL}/auth/${userId}`);
  }

  saveToken(token: string) {
    this.cookieService.set('token', token, 1, '/', '', true, 'Strict');

    try {
      const decoded = jwtDecode<any>(token);
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      if (role) {
        localStorage.setItem('userRole', role);
      }
    } catch (e) {
      console.error('Failed to decode token', e);
    }
  }

  getToken(): string | null {
    return this.cookieService.get('token') || null;
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const exp = decoded.exp;
      const now = Math.floor(Date.now() / 1000);

      return exp > now;
    } catch (err) {
      return false;
    }
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded = jwtDecode<any>(token);
      return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null;
    } catch (e) {
      return null;
    }
  }

  logout() {
    this.cookieService.delete('token', '/');
     localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }

  checkLoginStatus(): Observable<boolean> {
    const isValid = this.isLoggedIn();
    return of(isValid).pipe(delay(500));
  }
}
