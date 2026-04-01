import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ComentarioRequest } from '../../dto/request/ComentarioRequest';
import { ComentarioResponse } from '../../dto/response/ComentarioResponse';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  private apiUrl = `${environment.apiUrl}/api/comentario`;

  constructor(private http: HttpClient) {}

  // ================= TODOS LOS COMENTARIOS (solo ADMIN) =================
  obtenerTodos(): Observable<ComentarioResponse[]> {
    return this.http.get<ComentarioResponse[]>(`${this.apiUrl}/todos`);
  }

  // ================= COMENTARIOS POR PUBLICACION =================
  obtenerPorPublicacion(publicacionId: number, page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.apiUrl}/publicacion/${publicacionId}`, { params });
  }

  // ================= BUSCAR POR ID (solo ADMIN) =================
  obtenerPorId(id: number): Observable<ComentarioResponse> {
    return this.http.get<ComentarioResponse>(`${this.apiUrl}/buscar/${id}`);
  }

  // ================= CREAR COMENTARIO =================
  crear(dato: ComentarioRequest): Observable<ComentarioResponse> {
    return this.http.post<ComentarioResponse>(`${this.apiUrl}/crear`, dato);
  }

  // ================= EDITAR COMENTARIO =================
  editar(id: number, dato: ComentarioRequest): Observable<ComentarioResponse> {
    return this.http.put<ComentarioResponse>(`${this.apiUrl}/editar/${id}`, dato);
  }

  // ================= ELIMINAR COMENTARIO =================
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/borrar/${id}`);
  }
}