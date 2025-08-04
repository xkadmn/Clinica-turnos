import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from 'src/app/servicios/usuario.service';
@Component({
  selector: 'app-bienvenida3',
  templateUrl: './bienvenida3.component.html',
  styleUrls: ['./bienvenida3.component.css']
  
})
export class Bienvenida3Component {
  seccionActual: string = 'medicos'; 
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  filtroTipoUsuario: string = '';

  constructor(public usuarioService: UsuarioService) {}
    ngOnInit(): void {
    this.cargarUsuarios();
  }

  mostrarSeccion(seccion: string) {
    this.seccionActual = seccion; 
  }
   cargarUsuarios() {
    this.usuarioService.getTodosUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.usuariosFiltrados = data;
      },
      error: (err) => console.error('Error cargando usuarios:', err)
    });
  }

  filtrarUsuarios() {
    if (!this.filtroTipoUsuario) {
      this.usuariosFiltrados = this.usuarios;
    } else {
      this.usuariosFiltrados = this.usuarios.filter(
        u => u.tipo == this.filtroTipoUsuario
      );
    }
  }
}
