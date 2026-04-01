import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PublicacionResponse } from '../../dto/response/PublicacionResponse';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  private apiUrl = `${environment.apiUrl}/api/publicacion`;

  constructor(private http: HttpClient) {}

  // Obtener todos (ADMIN)
  obtenerTodos(): Observable<PublicacionResponse[]> {
    return this.http.get<PublicacionResponse[]>(`${this.apiUrl}/todos`);
  }

  crear(data: { titulo: string; descripcion: string; usuarioId: number }): Observable<PublicacionResponse> {
    return this.http.post<PublicacionResponse>(`${this.apiUrl}/crear`, data);
  }

  obtenerPorUsuario(id: number): Observable<PublicacionResponse[]> {
    return this.http.get<PublicacionResponse[]>(`${this.apiUrl}/todasporusuario/${id}`);
  }

  // Editar
  editar(id: number, data: { titulo: string; descripcion: string }): Observable<PublicacionResponse> {
    return this.http.put<PublicacionResponse>(`${this.apiUrl}/editar/${id}`, data);
  }

  // Eliminar
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/borrar/${id}`);
  }
}