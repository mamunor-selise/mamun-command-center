import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User, AuthResponse } from '../models/user.model';

const TOKEN_KEY = 'mcc_auth_token';
const USER_KEY = 'mcc_auth_user';
const API_BASE_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);

  currentUser = signal<User | null>(null);
  token = signal<string>('');
  isLoading = signal<boolean>(false);

  isAuthenticated = computed(() => !!this.currentUser() && !!this.token());

  constructor() {
    this.initSession();
  }

  private initSession() {
    if (isPlatformBrowser(this.platformId)) {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);

      if (savedToken && savedUser) {
        try {
          this.token.set(savedToken);
          this.currentUser.set(JSON.parse(savedUser));
          this.validateRemoteSession(savedToken);
        } catch (e) {
          this.logout();
        }
      }
    }
  }

  private async validateRemoteSession(savedToken: string) {
    try {
      let response: Response;
      try {
        response = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${savedToken}` }
        });
        if (response.status === 404) {
          response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${savedToken}` }
          });
        }
      } catch (e) {
        response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${savedToken}` }
        });
      }

      if (response.ok) {
        const data: AuthResponse = await response.json();
        if (data.user) {
          this.currentUser.set(data.user);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
          }
        }
      } else if (response.status === 401) {
        this.logout();
      }
    } catch (e) {
      console.warn('MongoDB Atlas Auth API server unreachable during session validation.');
    }
  }

  async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    this.isLoading.set(true);
    try {
      let response: Response;

      // 1. Try relative /api/auth/signup
      try {
        response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        // 2. If 404, try direct API server on port 3000
        if (response.status === 404) {
          response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
          });
        }
      } catch (networkErr) {
        // Fallback to direct localhost:3000 if proxy failed
        response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
      }

      const data: AuthResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || data.message || 'Signup failed.');
      }

      if (data.token && data.user) {
        this.setSession(data.token, data.user);
      }
      return data;
    } catch (err: any) {
      console.error('MongoDB Atlas Signup Error:', err);
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  async signin(email: string, password: string): Promise<AuthResponse> {
    this.isLoading.set(true);
    try {
      let response: Response;

      try {
        response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (response.status === 404) {
          response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
        }
      } catch (networkErr) {
        response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
      }

      const data: AuthResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || data.message || 'Invalid email or password.');
      }

      if (data.token && data.user) {
        this.setSession(data.token, data.user);
      }
      return data;
    } catch (err: any) {
      console.error('MongoDB Atlas Signin Error:', err);
      throw err;
    } finally {
      this.isLoading.set(false);
    }
  }

  async logout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${this.token()}` }
      }).catch(() => fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${this.token()}` }
      }));
    } catch (e) {
      console.warn('Backend server logout endpoint unreachable.');
    } finally {
      this.token.set('');
      this.currentUser.set(null);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
  }

  private setSession(tokenStr: string, user: User) {
    this.token.set(tokenStr);
    this.currentUser.set(user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(TOKEN_KEY, tokenStr);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }
}
