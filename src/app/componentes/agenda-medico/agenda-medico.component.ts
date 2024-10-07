import { Component, OnInit } from '@angular/core';
import { TurnoService } from 'src/app/servicios/turno.service';
import { Turno } from 'src/app/entidades/medico';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-agenda-medico',
  templateUrl: './agenda-medico.component.html',
  styleUrls: ['./agenda-medico.component.css']
})
export class AgendaMedicoComponent implements OnInit {
  fechaInicioSemana: Date;
  fechaFinSemana: Date;
  diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes','Sábado','Domingo'];
  horas: string[] = [];
  turnos: any[] = [];
  medicoId!: number; // Para almacenar el ID del médico
  horasPorDia: { [key: string]: string[] } = {};
  especialidadSeleccionadaId: number = 0; // Inicializa con un valor por defecto
  especialidadId!: number;

  constructor(private turnoService: TurnoService, private route: ActivatedRoute) {
    this.setFechasSemana(new Date());
    this.fechaInicioSemana = new Date();
    this.fechaInicioSemana.setDate(this.fechaInicioSemana.getDate() - this.fechaInicioSemana.getDay() + 1); // Ajusta al lunes
    this.fechaFinSemana = new Date(this.fechaInicioSemana);
    this.fechaFinSemana.setDate(this.fechaFinSemana.getDate() + 4); // Viernes
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.medicoId = +params['medicoId']; // Obtiene el ID del médico de los parámetros de la ruta
      this.especialidadId = +params['especialidadId'];
      this.cargarTurnos(); // Carga los turnos para el médico específico
    });
  }

  setFechasSemana(fecha: Date) {
    const dia = fecha.getDay(); // Obtiene el día de la semana (0-6)
    const fechaInicio = new Date(fecha); // Copia la fecha actual
    fechaInicio.setDate(fechaInicio.getDate() - (dia === 0 ? 6 : dia - 1)); // Ajusta al lunes
    this.fechaInicioSemana = fechaInicio;

    const fechaFin = new Date(fechaInicio); // Copia fechaInicio
    fechaFin.setDate(fechaFin.getDate() + 6); // Suma 6 días para llegar al domingo
    this.fechaFinSemana = fechaFin;
}

isTurnoDisponible(dia: string, hora: string): boolean {
  const fechaTurno = this.convertirDia(dia);
  const especialidadId = this.obtenerEspecialidadSeleccionada() || 0; // Obtiene el ID de especialidad actual
  const turnosFiltrados = this.turnos.filter(turno => 
      turno.fecha === fechaTurno && 
      turno.hora === hora && 
      turno.especialidad_id === especialidadId // Verifica la especialidad
  );
  return turnosFiltrados.length > 0 && turnosFiltrados[0].disponible;
}

  convertirDia(dia: string): string {
    const diaIndex = this.diasSemana.indexOf(dia);
    const fecha = new Date(this.fechaInicioSemana);
    fecha.setDate(fecha.getDate() + diaIndex);
    return fecha.toISOString().split('T')[0]; // Devuelve en formato 'YYYY-MM-DD'
  }

  abrirTurno(dia: string, hora: string) {
    const turno = this.turnos.find(turno => turno.fecha === this.convertirDia(dia) && turno.hora === hora);
    if (turno) {
      // Muestra los detalles del turno
      console.log(turno);
    }
  }

  semanaAnterior() {
    this.setFechasSemana(new Date(this.fechaInicioSemana.setDate(this.fechaInicioSemana.getDate() - 7)));
    this.cargarTurnos();
}

semanaSiguiente() {
    this.setFechasSemana(new Date(this.fechaInicioSemana.setDate(this.fechaInicioSemana.getDate() + 7)));
    this.cargarTurnos();
}
obtenerEspecialidadSeleccionada(): number | null {
  return this.especialidadSeleccionadaId; // Retorna el ID de la especialidad seleccionada
}


cargarTurnos() {
  const fechaInicio = this.fechaInicioSemana.toISOString().split('T')[0];
  const fechaFin = this.fechaFinSemana.toISOString().split('T')[0];

  if (this.especialidadId === null) {
    console.error('No se ha seleccionado una especialidad');
    return; // Maneja el error según sea necesario
  }

  console.log(`Cargando turnos desde ${fechaInicio} hasta ${fechaFin} para médico ${this.medicoId} y especialidad ${this.especialidadId}`);

  this.turnoService.getTurnosMedicoporsemana(this.medicoId, this.especialidadId, fechaInicio, fechaFin).subscribe(data => {
    this.turnos = data;
    console.log('Turnos cargados:', this.turnos);

    // Agrupar turnos por día
    this.horasPorDia = this.inicializarHorasPorDia();
    this.turnos.forEach(turno => {
      const fechaTurno = turno.fecha.split('T')[0]; // Solo queremos la parte de la fecha
      const dia = this.convertirDiaATexto(fechaTurno);
      if (this.horasPorDia[dia]) {
        this.horasPorDia[dia].push(turno.hora); // Agrega el horario del turno al día correspondiente
      }
    });

  }, error => {
    console.error('Error al cargar turnos', error);
  });
}

// Método para inicializar horas por día
inicializarHorasPorDia() {
  const horasPorDia: { [key: string]: string[] } = {};
  this.diasSemana.forEach(dia => {
    horasPorDia[dia] = []; // Inicializa un array vacío para cada día
  });
  return horasPorDia;
}

// Método para convertir fecha a nombre de día
convertirDiaATexto(fecha: string): string {
  const dia = new Date(fecha).getDay(); // 0 es Domingo, 1 es Lunes, etc.
  return this.diasSemana[dia === 0 ? 6 : dia - 1]; // Ajustar para que Lunes sea el índice 0
}


}


