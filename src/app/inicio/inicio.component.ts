import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../service/AuthService/auth.service';
import { AuthRequest } from '../dto/request/AuthRequest';
import { UsuarioRequest } from '../dto/request/UsuarioRequest';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  showLogin = false;
  showRegister = false;

  // Login
  loginUsuario = '';
  loginPassword = '';

  // Registro
  registerUsuario = '';
  registerEmail = '';
  registerPassword = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Método de login
  login() {
    const request: AuthRequest = {
      email: this.loginUsuario,
      password: this.loginPassword
    };

    this.authService.login(request).subscribe({
      next: (response) => {
        console.log('Login exitoso, token:', response.token);
        this.authService.setToken(response.token);
        this.showLogin = false;
        this.router.navigate(['/dashboard']); // Redirige después del login
      },
      error: (err) => {
        console.error('Error al iniciar sesión:', err);
        alert('Usuario o contraseña incorrecta');
      }
    });
  }

  // Método de registro
  register() {
    const request: UsuarioRequest = {
      nombreUsuario: this.registerUsuario,
      email: this.registerEmail,
      password: this.registerPassword
    };

    this.authService.register(request).subscribe({
      next: (response) => {
        console.log('Registro exitoso, token:', response.token);
        this.authService.setToken(response.token);
        this.showRegister = false;
        this.router.navigate(['/inicio']); // Redirige después del registro
      },
      error: (err) => {
        console.error('Error al registrar usuario:', err);
        alert('Error al registrar usuario');
      }
    });
  }
}