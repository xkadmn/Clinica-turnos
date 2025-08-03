// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { UsuarioService } from '../servicios/usuario.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  private getBienvenidaUrl(): UrlTree {
    const tipo = this.usuarioService.getUsuarioLogueado().tipo;
    // Arma el arreglo de segmentos según tu tipo
    const ruta = tipo === '1'
      ? ['/principal','bienvenida']
      : tipo === '2'
        ? ['/principal','bienvenida2']
        : ['/principal','bienvenida3'];
    return this.router.createUrlTree(ruta);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const url = state.url;

    // 1) Si NO hay token válido => siempre a login
    if (!this.usuarioService.estoyLogueado()) {
      return this.router.createUrlTree(['/principal','login']);
    }

    // 2) Si está logueado y pidió exactamente '/principal' (o '/principal/')
    if (url === '/principal' || url === '/principal/') {
      return this.getBienvenidaUrl();
    }

    // 3) Cualquier otra ruta protegida => deja pasar
    return true;
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    return this.canActivate(route, state);
  }
}