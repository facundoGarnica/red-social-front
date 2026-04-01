import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { UsuarioRequest } from '../../dto/request/UsuarioRequest';
import { AuthRequest } from '../../dto/request/AuthRequest';
import { AuthResponse } from '../../dto/response/AuthResponse';
import { UsuarioResponse } from '../../dto/response/UsuarioResponse';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiServer = environment.apiUrl + '/auth';

  private currentUserSubject = new BehaviorSubject<UsuarioResponse | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // al inicializar, intentar cargar usuario si hay token
    if (this.isBrowser() && this.getToken()) {
      this.fetchCurrentUser().subscribe(); // actualiza BehaviorSubject si hay token
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // ================= LOGIN / REGISTRO =================
  login(request: AuthRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.apiServer}/login`, request).pipe(
      tap(response => this.setToken(response.token))
    );
  }

  register(request: UsuarioRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.apiServer}/register`, request).pipe(
      tap(response => this.setToken(response.token))
    );
  }

  // ================= TOKEN =================
  setToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('authToken', token);
      this.fetchCurrentUser().subscribe(); // actualizar usuario automáticamente
    }
  }

  getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('authToken');
    }
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ================= USUARIO LOGUEADO =================
  fetchCurrentUser(): Observable<UsuarioResponse | null> {
    const token = this.getToken();
    if (!token) {
      this.currentUserSubject.next(null);
      return of(null);
    }

    return this.httpClient.get<UsuarioResponse>(
      `${this.apiServer}/me`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).pipe(
      tap(user => this.currentUserSubject.next(user)),
      catchError(err => {
        this.currentUserSubject.next(null);
        return of(null);
      })
    );
  }

  getCurrentUser(): Observable<UsuarioResponse | null> {
    return this.currentUser$;
  }
}