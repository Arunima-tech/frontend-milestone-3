import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userRole = signal<string>('ADMIN');

  isLoggedIn(): boolean {
    return true;
  }

  getRole(): string {
    return this.userRole();
  }

  hasRole(requiredRole: string): boolean {
    return this.userRole() === requiredRole;
  }
}
