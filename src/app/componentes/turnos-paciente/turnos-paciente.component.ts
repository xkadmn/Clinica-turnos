import { Component, OnInit } from '@angular/core';
import { TurnoService } from 'src/app/servicios/turno.service'; 
import { UsuarioService } from 'src/app/servicios/usuario.service'; 
import { Turno, Medico, Especialidad } from 'src/app/entidades/medico';
import { Router } from '@angular/router';
import { MedicoService } from 'src/app/servicios/medico.service';
@Component({
  selector: 'app-turnos-paciente',
  templateUrl: './turnos-paciente.component.html',
  styleUrls: ['./turnos-paciente.component.css']
})
export class TurnosPacienteComponent implements OnInit {
  public turnos: Turno[] = [];
  public medicos: Medico[] = [];
  public especialidades: Especialidad[] = [];
  public turnoParaPuntuar: Turno | null = null;
  public mostrarModalPuntuacion = false;
  public valorPuntuacion = 0;
  public comentarioNueva = '';
  public comentarioGuardado = '';
  isLoading = false;



  constructor(private TurnoService: TurnoService, private usuarioService: UsuarioService, private medicoService: MedicoService, private router: Router) {
    console.log('Constructor de TurnosPacienteComponent llamado');
  }
  
  ngOnInit(): void {
    const pacienteId = this.usuarioService.usuarioLogueado.id;
    console.log('ID del paciente:', pacienteId);
    console.log('ngOnInit llamado');
    this.obtenerTurnos();
  }

  formatearFecha(fecha: string): string {
    const fechaObj = new Date(fecha); // Crear un objeto Date a partir de la fecha recibida
    const dia = String(fechaObj.getUTCDate()).padStart(2, '0'); // Obtener el día
    const mes = String(fechaObj.getUTCMonth() + 1).padStart(2, '0'); // Obtener el mes (sumar 1 porque es 0-indexado)
    const año = fechaObj.getUTCFullYear(); // Obtener el año
    return `${dia}/${mes}/${año}`; // Retornar en formato 'DD/MM/YYYY'
  }

  volver() {
    this.router.navigate(['principal/bienvenida']);
  }

  cancelarTurno() {
    // Implementación del método para cancelar un turno
  }

obtenerTurnos() {
  this.isLoading = true;    
    this.TurnoService.getMisTurnos().subscribe({
      next: turnos => {
        this.turnos = turnos.map(t => ({
          ...t,
          fecha: this.formatearFecha(t.fecha),
          hora: t.hora.substring(0,5)
        }));
        this.isLoading = false;          // ← fin de carga
      },
      error: err => {
        console.error(err);
        this.isLoading = false;          // ← fin de carga (error)
      }
    });
}

onCancelarClick(turno: any) {
  if (this.obtenerEstado(turno) !== 'Pendiente') {
    return;
  }

  if (!confirm('¿Seguro que deseas cancelar este turno?')) return;

  this.TurnoService.cancelarTurnoPaciente(turno.id!).subscribe({
    next: () => {
      alert('Turno cancelado correctamente. Ahora está disponible para otros pacientes.');
      this.obtenerTurnos(); // Refresca la tabla
    },
    error: err => {
      console.error('Error al cancelar turno por paciente:', err);
      alert('No se pudo cancelar el turno.');
    }
  });
}
  

  obtenerEstado(turno: { fecha: string; hora: string; }): string {
    const [dia, mes, año] = turno.fecha.split('/').map(Number); // Convertir fecha a números
    const [horas, minutos] = turno.hora.split(':').map(Number); // Convertir hora a números
  
    // Crear un objeto Date a partir de la fecha y hora
    const fechaTurno = new Date(año, mes - 1, dia, horas, minutos);
    const ahora = new Date(); // Obtener la fecha y hora actuales
  
    // Comparar las fechas y horas
    if (fechaTurno > ahora) {
      return 'Pendiente'; // Turno futuro
    } else {
      return 'Terminado'; // Turno pasado
    }
  }

   public starButtonClass(turno: Turno): string {
    if (turno.puntuacion && turno.puntuacion > 0) {
      // Ya puntuado → dorado fijo
      return 'star-rated';
    }
    if (this.obtenerEstado(turno) === 'Terminado') {
      // Terminó y no hay puntuación → hover dorado
      return 'star-clickable';
    }
    // Pendiente u otro estado → gris y no clicable
    return 'star-disabled';
  }

abrirModalPuntuacion(turno: Turno) {
  this.turnoParaPuntuar = turno;
  this.valorPuntuacion = turno.puntuacion ?? 0;
  this.comentarioGuardado = turno['comentario'] || '';
  this.comentarioNueva = '';
  this.mostrarModalPuntuacion = true;
}

cerrarModalPuntuacion() {
  this.mostrarModalPuntuacion = false;
  this.turnoParaPuntuar = null;
}


// 4) Enviar puntuación
submitPuntuacion() {
  if (!this.turnoParaPuntuar || this.turnoParaPuntuar.id === undefined) return;
  const id = this.turnoParaPuntuar.id;
  const body: any = { puntuacion: this.valorPuntuacion };
  if (this.comentarioNueva.trim()) {
    body.comentario = this.comentarioNueva.trim();
  }

  this.TurnoService.puntuarTurno(id, body).subscribe({
    next: () => {
      // Actualiza localmente
      this.turnoParaPuntuar!.puntuacion = this.valorPuntuacion;
      if (body.comentario) {
        this.comentarioGuardado = body.comentario;
        // Guardar campo en el objeto turno si lo necesitas
        (this.turnoParaPuntuar as any).comentario = body.comentario;
      }
      this.comentarioNueva = '';
    },
    error: err => {
      console.error('Error al enviar puntuación:', err);
    }
  });
}
  
 
  
}