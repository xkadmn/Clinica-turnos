import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { TurnoService } from 'src/app/servicios/turno.service';
import { Turno } from 'src/app/entidades/medico';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/servicios/usuario.service'; 
import { Router } from '@angular/router'; 
import { EspecialidadService } from 'src/app/servicios/especialidad.service';

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
  medicoNombre = '';
  medicoApellido = '';

  constructor(private turnoService: TurnoService, private route: ActivatedRoute, private usuarioService: UsuarioService,   private router: Router) {
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
       // Datos del profesional (usuario logueado)
      this.medicoNombre   = this.usuarioService.usuarioLogueado.nombre;
      this.medicoApellido = this.usuarioService.usuarioLogueado.apellido;
      this.cargarTurnos(); // Carga los turnos para el médico específico
    });

    
  }

    /** 
   * Mapea getDay() de JS (0=Domingo,...6=Sábado) 
   * al array Lunes(0)..Domingo(6)
   */
  private mapDiaJSaIndice(fechaStr: string): number {
        const [y,m,d] = fechaStr.split('T')[0].split('-').map(Number);
    const fechaUTC = new Date(Date.UTC(y, m-1, d));
    const diaJS = fechaUTC.getUTCDay(); // 0=Domingo
    return diaJS === 0 ? 6 : diaJS - 1;
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
  const fechaInicioStr = this.fechaInicioSemana.toISOString().split('T')[0]; 
  const fechaFinStr = this.fechaFinSemana.toISOString().split('T')[0]; 

  this.turnoService.getTurnosPublicosMedico(
      this.medicoId,
      this.especialidadId,
      fechaInicioStr,
      fechaFinStr
  )
  .subscribe(turnos => {
      console.log('Turnos recibidos:', turnos);
      this.organizarTurnosPorDia(turnos);
  });
}

  organizarTurnosPorDia(turnos: any[]) {
    this.horasPorDia = {};
    this.turnos = turnos;

    this.diasSemana.forEach(d => this.horasPorDia[d] = []);

    turnos.forEach(turno => {
      const fechaTurno = new Date(turno.fecha);
      const idx = this.mapDiaJSaIndice(turno.fecha);
      const diaNombre = this.diasSemana[idx];
      this.horasPorDia[diaNombre].push(turno.hora);
    });
  }

fechaFormato(fechaInicio: Date, index: number): Date {
  const fecha = new Date(fechaInicio);
  fecha.setDate(fecha.getDate() + index); // Suma el índice del día
  return fecha;
}

  isTurnoDisponible(hora: string, dia: string): boolean {
    const idxDia = this.diasSemana.indexOf(dia);
    const turno = this.turnos.find(t => {
      const turnoDiaIdx = this.mapDiaJSaIndice(t.fecha);
      return t.hora === hora && turnoDiaIdx === idxDia;
    });
    return turno ? (turno.disponible === 1 && !turno.seleccionado) : false;
  }

 getTurnoId(dia: string, hora: string): number | undefined {
    const idxDia = this.diasSemana.indexOf(dia);
    const turno = this.turnos.find(t => {
      const turnoDiaIdx = this.mapDiaJSaIndice(t.fecha);
      return t.hora === hora && turnoDiaIdx === idxDia;
    });
    return turno ? turno.id : undefined;
  }

   abrirTurno(id: number, dia: string, hora: string): void {
    const turno = this.turnos.find(t => t.id === id);
    if (turno?.disponible === 1) {
      // Convierte fecha string a Date
      const fechaTurno = new Date(turno.fecha);
      this.turnoSeleccionado = { ...turno, fecha: fechaTurno, seleccionado: true };

      // Carga la especialidad específica del turno (usa el campo retornado por la API)
      const espId = (turno as any).especialidad_id ?? (turno as unknown as any).especialidadId;
      this.isModalVisible = true;
    } else {
      alert('Este turno no está disponible.');
    }
  }



  aceptarTurno() {
    if (!this.turnoSeleccionado) return;
    const usuario = this.usuarioService.getUsuarioLogueado();
    const turnoActualizar = {
      id: this.turnoSeleccionado.id,
      usuario_paciente_id: usuario.id,
      disponible: 0
    };

    this.turnoService.aceptarTurno(turnoActualizar).subscribe({
      next: response => {
        console.log('Turno aceptado:', response);
        // 1) Cerrar modal y limpiar selección
        this.isModalVisible = false;
        this.turnoSeleccionado = null;
        this.cargarTurnos();

        // 2) Mostrar mensaje de éxito
        this.mensajeExito       = '¡Turno agendado con éxito!';
        this.mostrarModalExito  = true;

        // 3) Tras 2 s (duración de la animación), redirigir a 'Mis turnos'
        setTimeout(() => {
          this.mostrarModalExito = false;
          this.router.navigate(['/principal/turnos-paciente']);
        }, 2000);
      },
      error: err => {
        console.error('Error al aceptar el turno:', err);
        // aquí podrías mostrar un alert de error si quieres
      }
    });
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




