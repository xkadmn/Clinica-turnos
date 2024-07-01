import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../servicios/usuario.service'; 
@Injectable({
  providedIn: 'root'
})
export class UsuariosGuard implements CanLoad {

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
      
      const usuarioLogueado = this.usuarioService.getUsuarioLogueado();
      
      if (usuarioLogueado) {
        if (usuarioLogueado.tipo === '2') {
          return true; // Permitir carga si el usuario es tipo 2 (médico)
        } else if (usuarioLogueado.tipo === '3') {
          this.router.navigate(['/principal/bienvenida3']);
          return false; // Redirigir al componente para tipo 3
        } else {
          this.router.navigate(['/principal/bienvenida2']);
          return false; // Redirigir al componente para tipo 1
        }
      } else {
        this.router.navigate(['/principal/login']);
        return false; // Redirigir al componente de login si no hay usuario logueado
      }
  }
  
}