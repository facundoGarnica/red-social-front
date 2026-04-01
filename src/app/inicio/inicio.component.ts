import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../service/AuthService/auth.service';
import { AuthRequest } from '../dto/request/AuthRequest';
import { UsuarioRequest } from '../dto/request/UsuarioRequest';
import { Observable } from 'rxjs';
import { UsuarioResponse } from '../dto/response/UsuarioResponse';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  // MODALES
  showLogin = false;
  showRegister = false;

  // NAVBAR RESPONSIVE
  menuAbierto = false;

  // LOGIN
  loginUsuario = '';
  loginPassword = '';

  // REGISTRO
  registerUsuario = '';
  registerEmail = '';
  registerPassword = '';

  usuarioActual$: Observable<UsuarioResponse | null>;
  constructor(private authService: AuthService, private router: Router) {
    this.usuarioActual$ = this.authService.currentUser$;
    console.log(this.usuarioActual$);
  }

  // ================= EVENTOS =================

  @HostListener('document:keydown.escape')
  handleEscape() {
    this.closeModals();
  }

  @HostListener('document:click', ['$event'])
  cerrarMenuFuera(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.barra-navegacion')) {
      this.menuAbierto = false;
    }
  }

  // ================= LOGIN =================
  login() {
    if (!this.loginUsuario || !this.loginPassword) {
      alert('Complete todos los campos');
      return;
    }

    const request: AuthRequest = { email: this.loginUsuario, password: this.loginPassword };

    this.authService.login(request).subscribe({
      next: (response) => {
        // Guardar token
        this.authService.setToken(response.token);

        // 🔹 actualizar usuario logueado
        this.authService.fetchCurrentUser(); // fetchCurrentUser actualiza el BehaviorSubject

        this.resetLogin();
        this.closeModals();
        this.menuAbierto = false;

        this.router.navigate(['/dashboard']);
      },
      error: () => alert('Usuario o contraseña incorrectos')
    });
  }

  // ================= REGISTRO =================
  register() {
    if (!this.registerUsuario || !this.registerEmail || !this.registerPassword) {
      alert('Complete todos los campos');
      return;
    }

    if (!this.registerEmail.includes('@')) {
      alert('Ingrese un email válido');
      return;
    }

    if (this.registerPassword.length < 4) {
      alert('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    const request: UsuarioRequest = {
      nombreUsuario: this.registerUsuario,
      email: this.registerEmail,
      password: this.registerPassword
    };

    this.authService.register(request).subscribe({
      next: (response) => {
        // Guardar token
        this.authService.setToken(response.token);

        // 🔹 actualizar usuario logueado
        this.authService.fetchCurrentUser();

        this.resetRegister();
        this.closeModals();
        this.menuAbierto = false;

        this.router.navigate(['/dashboard']);
      },
      error: () => alert('Error al registrar usuario')
    });
  }

  // ================= ESTADO =================
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.menuAbierto = false;
    this.router.navigate(['/inicio']);
  }

  // ================= UTILIDADES =================
  closeModals() {
    this.showLogin = false;
    this.showRegister = false;
  }

  resetLogin() {
    this.loginUsuario = '';
    this.loginPassword = '';
  }

  resetRegister() {
    this.registerUsuario = '';
    this.registerEmail = '';
    this.registerPassword = '';
  }
}