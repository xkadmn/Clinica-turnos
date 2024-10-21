import { Component, OnInit } from '@angular/core';
import { TurnoService } from 'src/app/servicios/turno.service'; 
import { UsuarioService } from 'src/app/servicios/usuario.service'; 
import { Turno, Medico, Especialidad } from 'src/app/entidades/medico';
import { Router } from '@angular/router';
@Component({
  selector: 'app-turnos-paciente',
  templateUrl: './turnos-paciente.component.html',
  styleUrls: ['./turnos-paciente.component.css']
})
export class TurnosPacienteComponent implements OnInit {
  public turnos: Turno[] = [];



  constructor(private TurnoService: TurnoService, private usuarioService: UsuarioService,  private router: Router) {}

  ngOnInit(): void {
    const pacienteId = this.usuarioService.usuarioLogueado.id;
  
  

    this.TurnoService.getTurnosPorPaciente(pacienteId).subscribe(turnos => {
      this.turnos = turnos.map(turno => ({
        ...turno,
        fecha: this.formatearFecha(turno.fecha),
        hora: turno.hora.substring(0, 5),
        medicoId: turno.medicoId,
        especialidadId: turno.especialidadId
        
      }));
    });
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
  
}