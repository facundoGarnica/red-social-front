export interface UsuarioRequest {
  nombreUsuario: string;
  email: string;
  password: string;
  rolesIds?: number[];
}