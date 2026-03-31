import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

  interface Comentario {
    usuario: string;
    texto: string;
  }

  interface Post {
    usuario: string;
    fecha: string;
    texto: string;
    imagen?: string;
    avatar: string;
    likes: number;
    comentarios: Comentario[];
    nuevoComentario: string;
    showComments: boolean;
  }

@Component({
  selector: 'app-posts',
  imports: [FormsModule, CommonModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent {
  
    posts: Post[] = [
    {
      usuario: 'Juan Pérez',
      fecha: 'Hace 2 horas',
      texto: 'Hola! Esta es mi primera publicación 😄',
      imagen: 'https://via.placeholder.com/500',
      avatar: 'https://via.placeholder.com/50',
      likes: 0,
      comentarios: [], // 👈 ahora ya está bien tipado
      nuevoComentario: '',
      showComments: false
    }
  ];

  toggleLike(post: Post) {
    post.likes++;
  }

  agregarComentario(post: Post) {
    if (post.nuevoComentario.trim()) {
      post.comentarios.push({
        usuario: 'Tú',
        texto: post.nuevoComentario
      });
      post.nuevoComentario = '';
    }
  }
}
