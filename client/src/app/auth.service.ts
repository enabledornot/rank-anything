import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';

interface CurrentUser {
  id: string;
  username: string | null;
  isAnonymous: boolean;
  newUser: boolean;
}

interface MeResponse {
  authenticated: boolean;
  user: CurrentUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  readonly user = signal<CurrentUser | null>(null);
  readonly loading = signal(true);

  loadMe() {
    return this.http.get<MeResponse>('/api/auth/me');
  }
}