import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Verificamos si estamos en el navegador para acceder al localStorage
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('authToken') 
    : null;

  // Si hay token y no es una ruta de login/registro, lo clonamos
  if (token && !req.url.includes('/auth')) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` // ¡Importante usar backticks!
      }
    });
    return next(cloned);
  }

  return next(req);
};