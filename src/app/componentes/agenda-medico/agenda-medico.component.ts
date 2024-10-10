import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { TurnoService } from 'src/app/servicios/turno.service';
import { Turno } from 'src/app/entidades/medico';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/servicios/usuario.service'; 
import { Router } from '@angular/router'; // Importar Router
@Component({
  selector: 'app-agenda-medico',
  templateUrl: './agenda-medico.component.html',
  styleUrls: ['./agenda-medico.component.css']
})
export class AgendaMedicoComponent implements OnInit {
  @ViewChild('modal', { static: false }) modal!: ElementRef;
  fechaInicioSemana: Date;
  fechaFinSemana: Date;
  diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes','Sábado','Domingo'];
  horas: string[] = [];
  turnos: any[] = [];
  public fecha: string;
  medicoId!: number; // Para almacenar el ID del médico
  horasPorDia: { [key: string]: string[] } = {};
  especialidadSeleccionadaId: number = 0; // Inicializa con un valor por defecto
  especialidadId!: number;
  turnoSeleccionado: any; // Para almacenar el turno seleccionado
  idTurno?: number;
  mensajeExito: string = ''; // Para almacenar el mensaje de éxito
  mostrarModalExito: boolean = false; // Para controlar la visibilidad del modal de éxito
  isModalVisible: boolean = false;


  constructor(private turnoService: TurnoService, private route: ActivatedRoute, private usuarioService: UsuarioService,  private router: Router) {
    this.setFechasSemana(new Date());
    this.fechaInicioSemana = new Date();
    this.fechaInicioSemana.setDate(this.fechaInicioSemana.getDate() - this.fechaInicioSemana.getDay() + 1); // Ajusta al lunes
    this.fechaFinSemana = new Date(this.fechaInicioSemana);
    this.fechaFinSemana.setDate(this.fechaFinSemana.getDate() + 4); // Viernes
    this.fecha = ''; 
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


cargarTurnos() {
  const fechaInicioStr = this.fechaInicioSemana.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  const fechaFinStr = this.fechaFinSemana.toISOString().split('T')[0]; // Formato YYYY-MM-DD

  this.turnoService.getTurnosMedicoPorsemana(this.medicoId, this.especialidadId, fechaInicioStr, fechaFinStr)
    .subscribe(turnos => {
      this.organizarTurnosPorDia(turnos);
    });
}

organizarTurnosPorDia(turnos: any[]) {
  this.horasPorDia = {};
  this.turnos = turnos; // Guarda los turnos
  turnos.forEach(turno => {
    const fechaTurno = new Date(turno.fecha); // Asume que el objeto 'turno' tiene una propiedad 'fecha'
    const diaNombre = this.diasSemana[fechaTurno.getDay()]; // Obtiene el nombre del día

    // Si no existe el día en el objeto, inicializa un array
    if (!this.horasPorDia[diaNombre]) {
      this.horasPorDia[diaNombre] = [];
    }

    // Agrega la hora del turno al día correspondiente
    const horaTurno = turno.hora; // Asume que el objeto 'turno' tiene una propiedad 'hora'
    this.horasPorDia[diaNombre].push(horaTurno); // Agrega la hora
  });
}

isTurnoDisponible(hora: string): boolean {
  const turno = this.turnos.find(t => t.hora === hora);
  return turno ? turno.disponible === 1 : false; // Devuelve true si disponible es 1, false de lo contrario
}

abrirTurno(id: number, dia: string, hora: string, medicoId: number) {
  const fechaTurno = new Date(this.fechaInicioSemana);
  const diaIndex = this.diasSemana.indexOf(dia);
  fechaTurno.setDate(fechaTurno.getDate() + diaIndex);

  const turno = this.turnos.find(t => t.id === id); // Encuentra el turno correspondiente

  // Solo abrir el modal si el turno está disponible
  if (turno && turno.disponible === 1) {
    this.turnoSeleccionado = {
      id: id,
      fecha: fechaTurno,
      hora: hora,
      medicoId: medicoId
    };
    this.isModalVisible = true; 
  } else {
    alert('Este turno no está disponible.');
  }
}

getTurnoId(dia: string, hora: string): number | undefined {
  const turno = this.turnos.find(t => t.hora === hora && new Date(t.fecha).getDay() === this.diasSemana.indexOf(dia));
  return turno ? turno.id : undefined; // Retorna el id si lo encuentra, sino undefined
}


aceptarTurno() {
  if (this.turnoSeleccionado) {
    const usuarioLogueado = this.usuarioService.getUsuarioLogueado();
    
    if (usuarioLogueado && usuarioLogueado.id) {
      const turnoActualizar = {
        id: this.turnoSeleccionado.id,
        usuario_paciente_id: usuarioLogueado.id,
        disponible: 0
      };

      console.log('Datos a enviar para actualizar el turno:', turnoActualizar);

      this.turnoService.aceptarTurno(turnoActualizar).subscribe(response => {
        console.log('Turno aceptado:', response);
        this.mensajeExito = 'Turno agendado con éxito!';
        this.cargarTurnos();
        this.isModalVisible = false; // Cierra el modal
        this.turnoSeleccionado = null; // Limpia la selección del turno
      }, error => {
        console.error('Error al aceptar el turno:', error);
      });
    } else {
      console.error('No hay usuario logueado');
    }
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

volver() {
  this.router.navigate(['principal/pedirturno']); // Cambia a la ruta correspondiente
}

}




