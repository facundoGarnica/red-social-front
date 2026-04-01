import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PublicacionService } from '../service/PublicacionService/publicacion.service';
import { ComentarioService } from '../service/ComentarioService/comentario.service';
import { PublicacionResponse } from '../dto/response/PublicacionResponse';
import { ComentarioResponse } from '../dto/response/ComentarioResponse';
import { AuthService } from '../service/AuthService/auth.service';
import { ComentarioRequest } from '../dto/request/ComentarioRequest';
import { InteraccionService } from '../service/InteraccionService/interaccion.service';

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
    meGustaDelUsuario: boolean;
    cargandoLike: boolean;
  })[] = [];

  userLogueado: { id: number; nombreUsuario: string } | null = null;

  constructor(
    private publicacionService: PublicacionService,
    private comentarioService: ComentarioService,
    private interaccionService: InteraccionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.userLogueado = user
        ? { id: user.id, nombreUsuario: user.nombreUsuario }
        : null;
    });

    this.cargarPosts();
  }

  // -------------------------
  // POSTS
  // -------------------------
  cargarPosts() {
    this.publicacionService.obtenerTodos().subscribe({
      next: (data: PublicacionResponse[]) => {
        this.posts = data.map(p => ({
          ...p,
          comentarios: [],
          nuevoComentario: '',
          showComments: false,
          fechaFormateada: this.formatearFecha(p.fechaCreacion),
          meGustaDelUsuario: false,
          cargandoLike: false
        }));

        this.posts.forEach(post => {
          this.cargarComentarios(post);
          this.cargarEstadoLike(post); // 👈 clave
        });
      },
      error: (err) => console.error('Error cargando publicaciones', err)
    });
  }

  // -------------------------
  // LIKES
  // -------------------------
  cargarEstadoLike(post: any) {
  if (!this.userLogueado) return;

  this.interaccionService.obtenerPorPublicacion(post.id).subscribe({
    next: (interacciones) => {
      post.meGustaDelUsuario = interacciones.some(i =>
        i.nombreUsuario === this.userLogueado?.nombreUsuario && i.meGusta
      );
      // Solo sincronizamos cantidadLikes al inicio desde aquí
      post.cantidadLikes = interacciones.filter(i => i.meGusta).length;
    },
    error: (err) => console.error('Error cargando likes', err)
  });
}

 toggleLike(post: any) {
  if (!this.userLogueado || post.cargandoLike) return;

  post.cargandoLike = true;
  const estadoPrevio = post.meGustaDelUsuario;

  const request = {
    usuarioId: this.userLogueado.id,
    publicacionId: post.id,
    meGusta: true
  };

  this.interaccionService.crear(request).subscribe({
    next: (res) => {
      post.meGustaDelUsuario = res.meGusta;

      if (res.meGusta && !estadoPrevio) {
        post.cantidadLikes++;
      } else if (!res.meGusta && estadoPrevio) {
        post.cantidadLikes = Math.max(0, post.cantidadLikes - 1);
      }

      post.cargandoLike = false;
    },
    error: (err) => {
      console.error('Error al dar like', err);
      post.meGustaDelUsuario = estadoPrevio;
      post.cargandoLike = false;
    }
  });
}

  // -------------------------
  // COMENTARIOS
  // -------------------------
  cargarComentarios(post: any) {
    this.comentarioService.obtenerPorPublicacion(post.id).subscribe({
      next: (page: any) => post.comentarios = page.content,
      error: (err) => console.error('Error cargando comentarios', err)
    });
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
        post.comentarios.push(comentario);
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
        post.comentarios = post.comentarios.filter(
          (c: ComentarioResponse) => c.id !== comment.id
        );
        post.cantidadComentarios--;
      },
      error: (err) => console.error('Error eliminando comentario', err)
    });
  }

  esComentarioDelUsuario(comment: ComentarioResponse): boolean {
    return this.userLogueado?.nombreUsuario === comment.nombreUsuario;
  }

  // -------------------------
  // UTIL
  // -------------------------
  formatearFecha(fecha: string): string {
    const ahora = new Date().getTime();
    const f = new Date(fecha).getTime();
    const diff = Math.floor((ahora - f) / 1000);

    if (diff < 60) return 'Hace unos segundos';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} hs`;

    return new Date(fecha).toLocaleDateString();
  }
}