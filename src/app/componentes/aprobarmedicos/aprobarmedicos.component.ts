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
  mensajeVisible: boolean = false;
  mensaje: string = '';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.getMedicos();
  }

  getMedicos() {
    this.usuarioService.getTodosLosMedicos().subscribe(
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
      this.medicosFiltrados = this.medicos; // Para 'todos'
    }
  }


  cambiarEstadoAprobacion(usuario: User) {
    const nuevoEstado = !usuario.aprobado;
    this.usuarioService.toggleAprobacionMedico(usuario.id, nuevoEstado).subscribe(
      () => {
        usuario.aprobado = nuevoEstado;
        this.filtrarMedicos();
        
        // Mostrar mensaje
        this.mostrarMensaje(nuevoEstado ? 'Usuario aprobado' : 'Usuario desaprobado');
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

  hoverButton(hover: boolean) {
    const botones = document.querySelectorAll('.btn-sm');
    botones.forEach(btn => {
      if (hover) {
        btn.classList.add('btn-hover');
      } else {
        btn.classList.remove('btn-hover');
      }
    });
  }

  mostrarMensaje(mensaje: string) {
    this.mensaje = mensaje;
    this.mensajeVisible = true;

    // Ocultar el mensaje después de 2 segundos
    setTimeout(() => {
      this.mensajeVisible = false;
    }, 2000);
  }

  
  verFicha(usuarioId: number) {
   
  }
  verPerfil(usuarioId: number) {
    
  }
}