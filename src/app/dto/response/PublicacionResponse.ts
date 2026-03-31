export interface PublicacionResponse {
  id: number;
  titulo: string;
  descripcion: string;
  nombreUsuario: string;
  imagenUrl?: string;    
  fechaCreacion: string;
  cantidadLikes: number;
  cantidadComentarios: number;
}