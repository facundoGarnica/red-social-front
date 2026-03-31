import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { UsuarioRequest } from '../../dto/request/UsuarioRequest';
import { AuthRequest } from '../../dto/request/AuthRequest';
import { AuthResponse } from '../../dto/response/AuthResponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiServer = environment.apiUrl + '/auth';

  constructor(private httpClient: HttpClient) {}

  // Método para login
  login(request: AuthRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.apiServer}/login`, request);
  }

  // Método para registrar un usuario
  register(request: UsuarioRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.apiServer}/register`, request);
  }

  // Método opcional para guardar token en localStorage
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Método opcional para obtener token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Método opcional para eliminar token al logout
  logout(): void {
    localStorage.removeItem('authToken');
  }
}
