import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { InteraccionResponse } from '../../dto/response/InteraccionResponse';
import { InteraccionRequest } from '../../dto/request/InteraccionRequest';

@Injectable({
  providedIn: 'root'
})
export class InteraccionService {

  private apiUrl = `${environment.apiUrl}/api/interaccion`;

  constructor(private http: HttpClient) {}

  // Obtener todas las interacciones (solo ADMIN)
  obtenerTodos(): Observable<InteraccionResponse[]> {
    return this.http.get<InteraccionResponse[]>(`${this.apiUrl}/todos`);
  }

  // Crear o toggle de like (ADMIN o USUARIO)
  crear(data: InteraccionRequest): Observable<InteraccionResponse> {
    return this.http.post<InteraccionResponse>(`${this.apiUrl}/crear`, data);
  }

  // Obtener interacciones por publicación
  obtenerPorPublicacion(postId: number): Observable<InteraccionResponse[]> {
    return this.http.get<InteraccionResponse[]>(`${this.apiUrl}/porpublicacion/${postId}`);
  }

  // Obtener interacciones por usuario
  obtenerPorUsuario(usuarioId: number): Observable<InteraccionResponse[]> {
    return this.http.get<InteraccionResponse[]>(`${this.apiUrl}/porusuario/${usuarioId}`);
  }

  // Editar interacción por ID (solo ADMIN)
  editar(id: number, data: InteraccionRequest): Observable<InteraccionResponse> {
    return this.http.put<InteraccionResponse>(`${this.apiUrl}/editar/${id}`, data);
  }

  // Eliminar interacción por ID (ADMIN o USUARIO)
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/borrar/${id}`);
  }
}