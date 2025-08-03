import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../entidades/usuario';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, HttpClientModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
    showLogin = false;
    showAnimation = true;
    go() {
      this.showLogin = true;
    }
  
  public usuario: User = {
    id: 0,
    nombre: '',
    apellido: '',
    usuario: '',
    pass: '',
    mail: '',
    tipo: '',
    fecnac: '',
    aprobado: true,
  };
  
  public mantenerLogueado: boolean = false;
  public loginError: boolean = false;
 
  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {
    // Si ya hay un token válido, redirigir al dashboard
    const token = this.usuarioService.obtenerToken();
    if (token && !this.usuarioService.isTokenExpired(token)) {
      this.router.navigateByUrl('/principal/bienvenida');
    }

  }


  @HostListener('window:wheel', ['$event'])
  onScroll(e: WheelEvent) {
    if (e.deltaY > 0) {    // scroll hacia abajo
      this.showLogin = true;
    }
  }

  public onInputChange(): void {
  this.loginError = false; }
  
  public login(): void {
    console.log('Intentando login con:', this.usuario.usuario);
    this.usuarioService.loginJwt({ usuario: this.usuario.usuario, pass: this.usuario.pass })
      .subscribe(
        (response: any) => {
          console.log('Respuesta login JWT:', response);
          // Guardar token en storage
          this.usuarioService.guardarToken(response.token, this.mantenerLogueado);

          const tipoUsuario = Number(response.tipo);
          // Redirigir según rol
          switch (tipoUsuario) {
            case 1:
              this.router.navigateByUrl('/principal/bienvenida');
              break;
            case 2:
              this.router.navigateByUrl('/principal/bienvenida2');
              break;
            case 3:
              this.router.navigateByUrl('/principal/bienvenida3');
              break;
            default:
              console.error('Tipo de usuario no reconocido:', response.tipo);
          }
        },
        error => {
         console.error('Error en /login:', error);
         this.loginError = true; // Activar mensaje de error
        }
      );
  }

  /**
   * Cierra sesión: elimina token y redirige al login
   */
  public logout(): void {
    this.usuarioService.logout();
    this.router.navigateByUrl('/principal/login');
  }
}
