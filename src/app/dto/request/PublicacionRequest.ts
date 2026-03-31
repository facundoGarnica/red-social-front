export interface PublicacionRequest {
  titulo: string;
  descripcion: string;
  usuarioId: number;
  // imagen se envía aparte como FormData
}