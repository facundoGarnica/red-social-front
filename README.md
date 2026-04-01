# 🌐 Red Social — Frontend

> Aplicación web desarrollada con **Angular 19** que consume la API REST del backend de la red social. Implementa autenticación con JWT, gestión de sesión, control de acceso por roles y una arquitectura modular con servicios, modelos, interfaces y guards.

---

## 🧠 Conceptos y Patrones Implementados

| Concepto | Detalle |
|---|---|
| **Arquitectura modular** | Módulos separados por funcionalidad (auth, publicaciones, comentarios, interacciones) |
| **Servicios HTTP** | Comunicación con la API REST mediante `HttpClient` |
| **Interceptor JWT** | Adjunta automáticamente el token en cada petición autenticada |
| **Guards** | Protección de rutas según autenticación y rol del usuario |
| **Interfaces / Modelos** | Tipado fuerte de los datos recibidos y enviados a la API |
| **Reactive Forms** | Formularios reactivos con validación en login, registro y creación de contenido |
| **LocalStorage** | Persistencia del token JWT y datos del usuario entre sesiones |
| **Role-Based Access** | Vistas y acciones diferenciadas para `ROLE_ADMIN` y `ROLE_USUARIO` |

---

## 🛠️ Stack Tecnológico

- **Angular 19**
- **TypeScript**
- **RxJS** — manejo de observables y llamadas asincrónicas
- **Angular Router** — navegación y rutas protegidas
- **HttpClient** — consumo de la API REST
- **CSS puro** — estilos personalizados sin frameworks externos

---

## 🚀 Instalación y Ejecución Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/red-social-frontend.git
cd red-social-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar la URL de la API

Editá el archivo `src/environments/environment.ts` con la URL de tu backend:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

### 4. Levantar la aplicación

```bash
ng serve
```

La app quedará disponible en `http://localhost:4200`.

> ⚠️ Asegurate de tener el backend corriendo en `http://localhost:8080` antes de iniciar el frontend. Podés consultar el [README del backend](../red-social-backend/README.md) para instrucciones de ejecución.

---

## 🔐 Usuarios de Prueba

Los mismos usuarios creados por el seeder del backend son válidos para iniciar sesión:

| Email | Contraseña | Rol |
|---|---|---|
| `user@redsocial.com` | `user123` | Usuario estándar |
| `admin@redsocial.com` | `admin123` | Administrador |

---

## 📂 Estructura del Proyecto

```
src/
└── app/
    ├── crear-post/                         # Componente de creación de publicación
    ├── dto/
    │   ├── request/
    │   │   ├── AuthRequest.ts              # DTO de login/registro
    │   │   ├── ComentarioRequest.ts        # DTO de creación de comentario
    │   │   ├── InteraccionRequest.ts       # DTO de creación de interacción
    │   │   ├── PublicacionRequest.ts       # DTO de creación de publicación
    │   │   ├── RolRequest.ts               # DTO de creación de rol
    │   │   ├── UsuarioRequest.ts           # DTO de creación de usuario
    │   │   └── UsuarioRolRequest.ts        # DTO de asignación de rol a usuario
    │   └── response/
    │       ├── AuthResponse.ts             # DTO de respuesta con token JWT
    │       ├── ComentarioResponse.ts       # DTO de respuesta de comentario
    │       ├── InteraccionResponse.ts      # DTO de respuesta de interacción
    │       ├── PublicacionResponse.ts      # DTO de respuesta de publicación
    │       ├── rolResponse.ts              # DTO de respuesta de rol
    │       ├── UsuarioResponse.ts          # DTO de respuesta de usuario
    │       └── UsuarioRolResponse.ts       # DTO de respuesta de asignación de rol
    ├── inicio/                             # Componente de página de inicio
    ├── interceptors/
    │   ├── auth.interceptor.ts             # Adjunta el token JWT a cada request
    │   └── auth.interceptor.spec.ts        # Tests del interceptor
    ├── posts/
    │   ├── posts.component.ts              # Lógica del listado de publicaciones
    │   ├── posts.component.html            # Template del listado
    │   ├── posts.component.css             # Estilos del componente
    │   └── posts.component.spec.ts         # Tests del componente
    ├── service/
    │   ├── AuthService/                    # Login, registro y gestión de sesión
    │   ├── ComentarioService/              # CRUD de comentarios
    │   ├── InteraccionService/             # Registro y gestión de interacciones
    │   ├── PublicacionService/             # CRUD de publicaciones
    │   ├── RolService/                     # Gestión de roles
    │   ├── UsuarioRolService/              # Asignación de roles a usuarios
    │   └── UsuarioService/                 # CRUD de usuarios
    ├── app.routes.ts                       # Definición de rutas y guards aplicados
    ├── app.config.ts                       # Configuración de providers (HttpClient, Router)
    └── app.component.ts                    # Componente raíz
```

---

## 🧩 Modelos e Interfaces

### `usuario.model.ts`
```typescript
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  roles: string[];
}
```

### `publicacion.model.ts`
```typescript
export interface Publicacion {
  id: number;
  contenido: string;
  fechaCreacion: string;
  usuarioId: number;
}
```

### `comentario.model.ts`
```typescript
export interface Comentario {
  id: number;
  contenido: string;
  fechaCreacion: string;
  usuarioId: number;
  publicacionId: number;
}
```

### `interaccion.model.ts`
```typescript
export interface Interaccion {
  id: number;
  tipo: string;
  usuarioId: number;
  publicacionId: number;
}
```

---

## 🔄 DTOs

### `auth-request.dto.ts`
```typescript
export interface AuthRequest {
  email: string;
  password: string;
}
```

### `auth-response.dto.ts`
```typescript
export interface AuthResponse {
  token: string;
  email: string;
  roles: string[];
}
```

### `publicacion-request.dto.ts`
```typescript
export interface PublicacionRequest {
  contenido: string;
  usuarioId: number;
}
```

### `comentario-request.dto.ts`
```typescript
export interface ComentarioRequest {
  contenido: string;
  usuarioId: number;
  publicacionId: number;
}
```

---

## 🔒 Guards y Seguridad

### `auth.guard.ts`
Verifica que exista un token JWT válido en `localStorage`. Si no hay sesión, redirige a `/login`.

### `admin.guard.ts`
Verifica que el usuario autenticado tenga el rol `ROLE_ADMIN`. Si no, redirige al inicio.

### `jwt.interceptor.ts`
Intercepta todas las peticiones HTTP salientes y agrega el encabezado de autorización:

```
Authorization: Bearer <token>
```

---

## 🗺️ Rutas Principales

| Ruta | Componente | Guard |
|---|---|---|
| `/Inicio` | `AuthComponent` | — |
| `/publicaciones` | `PublicacionComponent` | `AuthGuard` |
| `/new-post` | `PublicacionComponent` | `AuthGuard` |
| `**` | `NotFoundComponent` | — |

---

## 🔗 Conexión con el Backend

El frontend consume los endpoints REST del backend. A continuación, los servicios y sus llamadas principales:

### `auth.service.ts`
```typescript
login(request: AuthRequest): Observable<AuthResponse>
register(request: UsuarioRequest): Observable<AuthResponse>
setToken(token: string): void
getToken(): string | null
logout(): void
isLoggedIn(): boolean
fetchCurrentUser(): Observable<UsuarioResponse | null>
getCurrentUser(): Observable<UsuarioResponse | null>
```

### `publicacion.service.ts`
```typescript
obtenerTodos(): Observable<PublicacionResponse[]>
crear(data: { titulo: string; descripcion: string; usuarioId: number }): Observable<PublicacionResponse>
obtenerPorUsuario(id: number): Observable<PublicacionResponse[]>
editar(id: number, data: { titulo: string; descripcion: string }): Observable<PublicacionResponse>
eliminar(id: number): Observable<void>
```

### `comentario.service.ts`
```typescript
obtenerTodos(): Observable<ComentarioResponse[]>
obtenerPorPublicacion(publicacionId: number, page: number = 0, size: number = 10): Observable<any>
obtenerPorId(id: number): Observable<ComentarioResponse>
crear(dato: ComentarioRequest): Observable<ComentarioResponse>
editar(id: number, dato: ComentarioRequest): Observable<ComentarioResponse>
eliminar(id: number): Observable<void>
```

### `interaccion.service.ts`
```typescript
obtenerTodos(): Observable<InteraccionResponse[]>
crear(data: InteraccionRequest): Observable<InteraccionResponse>
obtenerPorPublicacion(postId: number): Observable<InteraccionResponse[]>
obtenerPorUsuario(usuarioId: number): Observable<InteraccionResponse[]>
editar(id: number, data: InteraccionRequest): Observable<InteraccionResponse>
eliminar(id: number): Observable<void>
```

---

## 👤 Contacto

**Facundo Garnica**
📧 facundogarnica1996@gmail.com