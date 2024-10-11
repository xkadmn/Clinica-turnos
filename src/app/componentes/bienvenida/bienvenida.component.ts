import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule,RouterModule,]
})
export class BienvenidaComponent implements OnInit {
  usuario: any; // Define la propiedad usuario

  constructor(private router: Router, private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuarioLogueado();
    if (!this.usuario) {
      // Si no hay un usuario logueado, redirigir al login
      this.router.navigate(['/login']);
    }
  }

  irAPedirTurno() {
    this.router.navigate(['/principal/pedirturno']); // Corregido: navegar hacia '/turnos'
  }

  misturnos() {
    this.router.navigate(['/principal/turnos-paciente']);
  }
}
