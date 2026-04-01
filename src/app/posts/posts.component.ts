import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PublicacionService } from '../service/PublicacionService/publicacion.service';
import { ComentarioService } from '../service/ComentarioService/comentario.service';
import { PublicacionResponse } from '../dto/response/PublicacionResponse';
import { ComentarioResponse } from '../dto/response/ComentarioResponse';
import { AuthService } from '../service/AuthService/auth.service';
import { ComentarioRequest } from '../dto/request/ComentarioRequest';

@Component({
  selector: 'app-posts',
  imports: [FormsModule, CommonModule],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  posts: (PublicacionResponse & {
    comentarios: ComentarioResponse[];
    nuevoComentario: string;
    showComments: boolean;
    fechaFormateada: string;
  })[] = [];

  userLogueado: { id: number; nombreUsuario: string } | null = null;

  constructor(
    private publicacionService: PublicacionService,
    private comentarioService: ComentarioService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Suscribirse al usuario logueado una sola vez
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userLogueado = { id: user.id, nombreUsuario: user.nombreUsuario };
      } else {
        this.userLogueado = null;
      }
    });

    this.cargarPosts();
  }

  cargarPosts() {
    this.publicacionService.obtenerTodos().subscribe({
      next: (data: PublicacionResponse[]) => {
        this.posts = data.map(p => ({
          ...p,
          comentarios: [],
          nuevoComentario: '',
          showComments: false,
          fechaFormateada: this.formatearFecha(p.fechaCreacion)
        }));

        this.posts.forEach(post => this.cargarComentarios(post));
      },
      error: (err) => console.error('Error cargando publicaciones', err)
    });
  }

  cargarComentarios(post: any) {
    this.comentarioService.obtenerPorPublicacion(post.id).subscribe({
      next: (page: any) => post.comentarios = page.content,
      error: (err) => console.error('Error cargando comentarios', err)
    });
  }

  formatearFecha(fecha: string): string {
    const ahora = new Date().getTime();
    const f = new Date(fecha).getTime();
    const diff = Math.floor((ahora - f) / 1000);

    if (diff < 60) return 'Hace unos segundos';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} hs`;

    return new Date(fecha).toLocaleDateString();
  }

  toggleLike(post: any) {
    post.cantidadLikes++;
  }

  agregarComentario(post: any) {
    const texto = post.nuevoComentario.trim();
    if (!texto || !this.userLogueado) return;

    const request: ComentarioRequest = {
      contenido: texto,
      usuarioId: this.userLogueado.id,
      publicacionId: post.id
    };

    this.comentarioService.crear(request).subscribe({
      next: (comentario) => {
        post.comentarios.push(comentario); // ComentarioResponse real
        post.nuevoComentario = '';
        post.cantidadComentarios++;
      },
      error: (err) => console.error('Error creando comentario', err)
    });
  }

  eliminarComentario(post: any, comment: ComentarioResponse) {
    if (!confirm('¿Seguro que quieres eliminar este comentario?')) return;

    this.comentarioService.eliminar(comment.id).subscribe({
      next: () => {
        // Remover comentario del array
        post.comentarios = post.comentarios.filter((c: ComentarioResponse) => c.id !== comment.id);
        post.cantidadComentarios--;
      },
      error: (err) => console.error('Error eliminando comentario', err)
    });
  }
  esComentarioDelUsuario(comment: ComentarioResponse): boolean {
    const esUsuario = this.userLogueado?.nombreUsuario === comment.nombreUsuario;
    console.log(`Verificando comentario: ${comment.id}, esUsuario: ${esUsuario}`);
    return esUsuario;
  }
}