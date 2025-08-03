import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioService } from '../servicios/usuario.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private usuarioService: UsuarioService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.usuarioService.obtenerToken();
    if (token) {
      // Clona la petición y añade el encabezado
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(authReq);
    }
    // Si no hay token, pasa la petición sin cambios
    return next.handle(req);
  }
}
