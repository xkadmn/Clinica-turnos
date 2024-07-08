import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';  // Ajusta la ruta según tu estructura
import { User } from 'src/app/entidades/usuario';
import { AprobadoPipe } from 'src/app/pipes/aprobado.pipe';

@Component({
  selector: 'app-aprobarmedicos',
  templateUrl: './aprobarmedicos.component.html',
  styleUrls: ['./aprobarmedicos.component.css']
})
export class AprobarmedicosComponent implements OnInit {
  medicos: User[] = [];
  medicosFiltrados: User[] = [];
  filtroEstado: string = 'noAprobados';

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.getMedicos();
  }

  getMedicos() {
    this.usuarioService.getMedicosNoAprobados().subscribe(
      (data: User[]) => {
        this.medicos = data;
        this.filtrarMedicos();
      },
      error => {
        console.log('Error al obtener médicos:', error);
      }
    );
  }

  filtrarMedicos() {
    if (this.filtroEstado === 'aprobados') {
      this.medicosFiltrados = this.medicos.filter(medico => medico.aprobado);
    } else if (this.filtroEstado === 'noAprobados') {
      this.medicosFiltrados = this.medicos.filter(medico => !medico.aprobado);
    } else {
      this.medicosFiltrados = this.medicos;
    }
  }

  verFicha(usuarioId: number) {
    // Implementa lógica para ver la ficha del usuario con el ID proporcionado
  }

  cambiarEstadoAprobacion(usuario: User) {
    const nuevoEstado = !usuario.aprobado;
    this.usuarioService.toggleAprobacionMedico(usuario.id, nuevoEstado).subscribe(
      () => {
        usuario.aprobado = nuevoEstado;
        this.filtrarMedicos();
      },
      error => {
        console.log(`Error al ${nuevoEstado ? 'aprobar' : 'desaprobar'} médico con ID ${usuario.id}:`, error);
      }
    );
  }

  cambiarFiltro(nuevoFiltro: string) {
    this.filtroEstado = nuevoFiltro;
    this.filtrarMedicos();
  }
}