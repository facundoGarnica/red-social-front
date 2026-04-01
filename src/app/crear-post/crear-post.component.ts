import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicacionService } from '../service/PublicacionService/publicacion.service';
import { AuthService } from '../service/AuthService/auth.service';
import { PublicacionResponse } from '../dto/response/PublicacionResponse';

@Component({
  selector: 'app-crear-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-post.component.html',
  styleUrls: ['./crear-post.component.css']
})
export class CrearPostComponent implements OnInit {
  titulo = '';
  descripcion = '';
  cargando = false;
  posts: PublicacionResponse[] = [];
  usuarioId!: number;

  constructor(
    private publicacionService: PublicacionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(usuario => {
      if (usuario) {
        this.usuarioId = usuario.id;
        this.cargarPosts();
      }
    });
  }

  cargarPosts(): void {
    this.publicacionService.obtenerPorUsuario(this.usuarioId).subscribe({
      next: (data) => this.posts = data,
      error: (err) => console.error('Error al cargar posts', err)
    });
  }

  crearPost(): void {
    if (!this.titulo.trim() || !this.descripcion.trim()) return;

    this.cargando = true;
    this.publicacionService.crear({
      titulo: this.titulo,
      descripcion: this.descripcion,
      usuarioId: this.usuarioId
    }).subscribe({
      next: (nuevo) => {
        this.posts.unshift(nuevo);
        this.titulo = '';
        this.descripcion = '';
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al crear post', err);
        this.cargando = false;
      }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Seguro que querés eliminar esta publicación?')) return;

    this.publicacionService.eliminar(id).subscribe({
      next: () => this.posts = this.posts.filter(p => p.id !== id),
      error: (err) => console.error('Error al eliminar', err)
    });
  }
}