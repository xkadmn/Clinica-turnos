import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService } from 'src/app/servicios/usuario.service'; 
import { PerfilComponent } from '../perfil/perfil.component';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule, PerfilComponent],
})
export class MenuComponent {
  constructor(private router: Router, public usuarioservices: UsuarioService) {}
  public logout() {
    this.usuarioservices.logout();
    this.router.navigateByUrl('/principal/login');
  }
}
