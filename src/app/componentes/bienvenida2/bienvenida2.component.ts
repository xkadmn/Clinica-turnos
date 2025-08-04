import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Especialidad, Turno } from 'src/app/entidades/medico';
import { Perfil } from 'src/app/entidades/usuario';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from 'src/app/servicios/usuario.service'; 
import { EspecialidadService } from 'src/app/servicios/especialidad.service'; 
import { MedicoService } from 'src/app/servicios/medico.service';
import { TurnoService } from 'src/app/servicios/turno.service';
import { EstadisticasService, Estadisticas } from 'src/app/servicios/estadisticas.service';
import { forkJoin } from 'rxjs';
import { SpinnerComponent } from '../spinner/spinner.component'; // ajusta ruta si es distinto

@Component({
  selector: 'app-bienvenida2',
  templateUrl: './bienvenida2.component.html',
  styleUrls: ['bienvenida2.component.css'],
  standalone: true,
  imports: [RouterModule, FormsModule, HttpClientModule, CommonModule, SpinnerComponent],
})
export class Bienvenida2Component implements OnInit {

  usuario: any; 
  seccionActual: string = 'agenda'; // 'agenda' o 'habilitar-turnos'
  subseccionActual: string = 'listaTurnos'; // 'calendario' o 'listaTurnos'
  especialidades: Especialidad[] = [];
  especialidadesMap: { [id: number]: string } = {};

  turno: Turno = {
    id: 0,
    especialidadId: 0,
    fecha: '',
    hora: '',
    //horaFin: '',
    medicoId: 0,
    disponible: 1,
    pacienteId: undefined 
  }; 
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  fechaInicioSemana: Date = new Date(); 
  fechaFinSemana: Date = new Date();
  fechasSemana: Date[] = [];
  turnos: Turno[] = [];
  horasDisponibles: string[] = [];
  horariosSeleccionados: string[] = [];
  turnoMes: any = {
    especialidadId: 0,
    mes: '', 
  };
  diasSeleccionados: string[] = [];
  turnosPorDia: Record<string, Turno[]> = {};
  stats: Estadisticas | null = null;
  perfilUsuario!: Perfil;
  stars: ('full' | 'half' | 'empty')[] = [];
  loadingStats: boolean = false;
  
  
  constructor(private http: HttpClient,  private turnoService: TurnoService,public usuarioService: UsuarioService, private especialidadService: EspecialidadService, private medicoService: MedicoService,   private statsSvc: EstadisticasService  ) {}

  ngOnInit(): void {
    this.usuario = this.usuarioService.getUsuarioLogueado();
    console.log('Usuario:', this.usuario);
      if (this.usuario) {
    // Normalizar aprobado de inmediato
    this.usuario.aprobado = Number(this.usuario.aprobado) === 1;
  }
  
  console.log('Aprobado:', this.usuario?.aprobado);
    this.obtenerEspecialidadesMedico();
    this.generarHorariosDisponibles();
    this.calcularFechasSemanaActual();
    this.cargarTurnos(); 
   
  }

get bloqueadoPorAprobacion(): boolean {
  return !this.usuario?.aprobado;
}

 mostrarSeccion(seccion: string) {
  this.seccionActual = seccion;
  if (seccion === 'agenda') {
    this.cargarTurnos();
  } else if (seccion === 'estadisticas') {
    this.cargarEstadisticas();
  }
}

  obtenerEspecialidadesMedico() {
  const medicoId = this.usuarioService.usuarioLogueado.id;
    console.log('>>> médico logueado, id =', medicoId);
    this.especialidadService.obtenerEspecialidadesMedico(medicoId).subscribe(
      especialidades => {
        this.especialidades = especialidades;

        // Crear el mapa de especialidades
        this.especialidadesMap = especialidades.reduce((map, especialidad) => {
          map[especialidad.id] = especialidad.nombre;
          return map;
        }, {} as { [id: number]: string });
      },
      error => {
        console.error('Error al obtener especialidades del médico:', error);
      }
    );
  }
    

  cargarTurnos() {
    // Formato YYYY-MM-DD
    const startDate = this.fechaInicioSemana.toISOString().split('T')[0];
    const endDate   = this.fechaFinSemana .toISOString().split('T')[0];
    const medicoId  = this.usuarioService.usuarioLogueado.id;

    console.log('Solicitando turnos desde:', startDate, 'hasta:', endDate);

    this.turnoService
      .getTurnosPorMedico(medicoId, startDate, endDate)
      .subscribe(
        data => {
          console.log('Turnos recibidos:', data);
          this.turnos = data;
          this.ordenarTurnos();
        },
        err => console.error('Error al obtener los turnos:', err)
      );
  }

  ordenarTurnos() {
    this.turnos.sort((a, b) => {
      const fechaA = new Date(a.fecha + 'T' + a.hora);
      const fechaB = new Date(b.fecha + 'T' + b.hora);
      return fechaA.getTime() - fechaB.getTime();
    });
  }
  get especialidadesMapList() {
    return Object.values(this.especialidadesMap);
  }
      
        



      generarHorariosDisponibles() {

        this.horasDisponibles = []; // Limpia los horarios anteriores
        const horaInicio = 7 * 60; // 7:00 am en minutos
        const horaFin = 19 * 60 + 40; // 19:40 en minutos
        const intervalo = 20; // Intervalo de 20 minutos
      
        for (let i = horaInicio; i <= horaFin; i += intervalo) {
          const hora = `${Math.floor(i / 60).toString().padStart(2, '0')}:${(i % 60).toString().padStart(2, '0')}`;
          this.horasDisponibles.push(hora);
        }
      }

      seleccionarHorario(hora: string) {
        if (this.horariosSeleccionados.includes(hora)) {
            this.horariosSeleccionados = this.horariosSeleccionados.filter(h => h !== hora);
        } else {
            this.horariosSeleccionados.push(hora);
        }
        console.log(this.horariosSeleccionados); // Verifica los horarios seleccionados
    }

      habilitarTurno() {
        
        const medicoId = this.usuarioService.usuarioLogueado.id; 
        const turnosACrear: Turno[] = this.horariosSeleccionados.map(hora => ({
          id: undefined,
          especialidadId: this.turno.especialidadId,
          fecha: this.turno.fecha,
          hora: hora,
          //horaFin: this.calcularHoraFin(hora),
          medicoId: medicoId,
          disponible: 1,
          pacienteId: undefined
        }));
      
        if (turnosACrear.length === 0) {
          console.error('No se han seleccionado horarios válidos.');
          return;
        }
      
        console.log('Turnos a crear:', turnosACrear);
      
        // Llamar al servicio para crear los turnos
        this.medicoService.habilitarTurno(turnosACrear).subscribe(
          (response: any) => {
            console.log('Turnos creados:', response);
            // Limpiar los filtros y campos después de crear los turnos
            this.limpiarFormulario();
            
          },
          (error: any) => {
            console.error('Error al crear turnos:', error);
          }
        );
      } 

      // Método para seleccionar días de la semana
  seleccionarDia(dia: string) {
    if (this.diasSeleccionados.includes(dia)) {
        this.diasSeleccionados = this.diasSeleccionados.filter(d => d !== dia);
    } else {
        this.diasSeleccionados.push(dia);
    }
  }

  seleccionarHorarioMes(hora: string) {
    if (this.horariosSeleccionados.includes(hora)) {
      this.horariosSeleccionados = this.horariosSeleccionados.filter(h => h !== hora);
    } else {
      this.horariosSeleccionados.push(hora);
    }
  }


  habilitarTurnoMes() {
    const medicoId = this.usuarioService.usuarioLogueado.id; 
    const turnosACrear: Turno[] = [];
    const fecha = new Date(this.turnoMes.mes + "-01");
    const diasDelMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate();

    console.log('Días seleccionados:', this.diasSeleccionados);
    console.log('Horarios seleccionados:', this.horariosSeleccionados);

    if (this.diasSeleccionados.length === 0 || this.horariosSeleccionados.length === 0) {
      console.error('No se han seleccionado días o horarios.');
      return;
    }

  for (let dia = 1; dia <= diasDelMes; dia++) {
    const fechaTurno = new Date(fecha.getFullYear(), fecha.getMonth(), dia);
    const diaSemana = fechaTurno.toLocaleString('es-ES', { weekday: 'long' }).toLowerCase().trim();

    console.log(`Verificando día: ${dia} => ${diaSemana}`);

    // Comparar con los días seleccionados en minúsculas
    const diasSeleccionadosLower = this.diasSeleccionados.map(d => d.toLowerCase());

    if (diasSeleccionadosLower.includes(diaSemana)) {
      for (const hora of this.horariosSeleccionados) {
        console.log(`Creando turno para ${diaSemana} a las ${hora}`);
        const turno: Turno = {
          id: undefined,
          especialidadId: this.turnoMes.especialidadId,
          fecha: fechaTurno.toISOString().split('T')[0], // Formato YYYY-MM-DD
          hora: hora,
          medicoId: medicoId,
          disponible: 1,
          pacienteId: undefined
        };
        turnosACrear.push(turno);
      }
    }
  }

  console.log('Turnos a crear:', turnosACrear);

  if (turnosACrear.length === 0) {
    console.error('No se han creado turnos, verifica la lógica.');
    return;
  }

  this.medicoService.habilitarTurno(turnosACrear).subscribe(
    (response: any) => {
      console.log('Turnos creados:', response);
      this.limpiarFormularioMes();
    },
    (error: any) => {
      console.error('Error al crear turnos:', error);
    }
  );
}

// Método para limpiar el formulario de habilitar turnos por mes
limpiarFormularioMes() {
  this.turnoMes = {
      especialidadId: 0,
      mes: '',
  };
  this.diasSeleccionados = [];
  this.horariosSeleccionados = [];
}

    limpiarFormulario() {
      this.turno = {
        id: 0,
        especialidadId: 0,
        fecha: '',
        hora: '',
        medicoId: this.usuarioService.usuarioLogueado.id,
        disponible: 1,
        pacienteId: undefined 
      };
      this.horariosSeleccionados = [];
    }

  // Mapa de días de la semana
  dias: { [key: string]: number } = {
    'Lunes': 1,
    'Martes': 2,
    'Miércoles': 3,
    'Jueves': 4,
    'Viernes': 5,
    'Sábado': 6,
    'Domingo': 0
  };

  // Obtener la fecha en formato YYYY-MM-DD para un día de la semana específico
  obtenerFechaPorDia(dia: string): string {
    const diaOffset = this.dias[dia];
    const fecha = new Date(this.fechaInicioSemana);
    fecha.setDate(fecha.getDate() + diaOffset);
    return fecha.toISOString().split('T')[0]; // YYYY-MM-DD
  }

   // Método para calcular el inicio y fin de la semana actual
calcularFechasSemanaActual(lunes?: Date): void {
  let inicio: Date;

  if (lunes) {
    inicio = new Date(lunes);
  } else {
    const hoy = new Date();
    const primerDia = hoy.getDate() - hoy.getDay() + (hoy.getDay() === 0 ? -6 : 1);
    inicio = new Date(hoy.setDate(primerDia));
  }

  this.fechaInicioSemana = new Date(inicio);
  this.fechaFinSemana    = new Date(inicio);
  this.fechaFinSemana.setDate(inicio.getDate() + 6);

  this.fechasSemana = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(inicio);
    d.setDate(inicio.getDate() + i);
    this.fechasSemana.push(d);
  }
}

semanaAnterior() {
  // calculo del lunes previo
  const lunesPrevio = new Date(this.fechaInicioSemana);
  lunesPrevio.setDate(lunesPrevio.getDate() - 7);
  this.calcularFechasSemanaActual(lunesPrevio);

  // recargo según la vista activa
  if (this.subseccionActual === 'calendario') {
    this.cargarCalendario();
  } else {
    this.cargarTurnos();
  }
}

semanaSiguiente() {
  // cálculo del lunes siguiente
  const lunesSiguiente = new Date(this.fechaInicioSemana);
  lunesSiguiente.setDate(lunesSiguiente.getDate() + 7);
  this.calcularFechasSemanaActual(lunesSiguiente);

  // recargo según la vista activa
  if (this.subseccionActual === 'calendario') {
    this.cargarCalendario();
  } else {
    this.cargarTurnos();
  }
}

  
  // Helper para determinar el estado de la celda
  getEstadoTurno(fecha: Date, hora: string): number {
    const fechaStr = fecha.toISOString().slice(0,10);
    const turno = this.turnos.find(t => t.fecha === fechaStr && t.hora === hora);
    return turno ? turno.disponible : -1;
  }

   mostrarSubseccion(sub: 'listaTurnos'|'calendario') {
    this.subseccionActual = sub;
    if (sub === 'calendario') {
      this.cargarCalendario();
    } else {
      this.cargarTurnos();
    }
  }

eliminarTurno(turnoId: number) {
  if (confirm('¿Estás seguro de que deseas eliminar este turno?')) {
    this.medicoService.eliminarTurno(turnoId).subscribe(
      () => {
        // Eliminar el turno de la lista local después de la eliminación exitosa
        this.turnos = this.turnos.filter(turno => turno.id !== turnoId);
        alert('Turno eliminado con éxito.');
      },
      (error) => {
        console.error('Error al eliminar el turno:', error);
        alert('Hubo un error al intentar eliminar el turno. Por favor, intenta nuevamente.');
      }
    );
  }
}

cancelarTurno(turnoId: number) {
  if (confirm('¿Estás seguro de que deseas cancelar el turno?')) {
    this.medicoService.cancelarTurno(turnoId).subscribe(
      () => {
        const turno = this.turnos.find(t => t.id === turnoId);
                if (turno) {
                    turno.disponible = 3; // Cambia el estado a 3 (cancelado)
                }
                alert('Turno cancelado con éxito.');
      },
      (error) => {
        console.error('Error al cancelar el turno:', error);
        alert('Hubo un error al intentar cancelar el turno. Por favor, intenta nuevamente.');
      }
    );
  }
}


cargarCalendario() {
    const inicio = this.fechaInicioSemana.toISOString().slice(0,10);
    const fin    = this.fechaFinSemana .toISOString().slice(0,10);
    const medico = this.usuarioService.usuarioLogueado.id;
    const espId  = this.turno.especialidadId;

    // Llamada semanal, filtrada por especialidad
    this.turnoService.getTurnosMedicoPorsemana(medico, espId, inicio, fin)
      .subscribe(todos => {
        // Inicializo el map
        this.diasSemana.forEach(d => this.turnosPorDia[d] = []);

        // Agrupo por fecha/día
        todos.forEach(t => {
          // Convierte "2025-07-28T00:00:00" → "2025-07-28"
          const iso = t.fecha.split('T')[0];
          // Encuentra índice de día
          const idx = this.fechasSemana
            .map(d => d.toISOString().slice(0,10))
            .indexOf(iso);
          if (idx >= 0) {
            const diaLabel = this.diasSemana[idx];
            this.turnosPorDia[diaLabel].push(t);
          }
        });

        // Ordeno dentro de cada día
        this.diasSemana.forEach(d => {
          this.turnosPorDia[d].sort((a,b) => a.hora.localeCompare(b.hora));
        });
      });
  }

  getCls(turno: Turno): string {
    if (turno.disponible === 1) return 'bg-pastel-success';
    if (turno.disponible === 0) return 'bg-pastel-danger';
    return 'bg-pastel-secondary';
  }

  /**
   * Para la lista: pinta la fila completa.
   */
  getRowCls(turno: Turno): string {
    if (turno.disponible === 1) return 'bg-pastel-success';
    if (turno.disponible === 0) return 'bg-pastel-danger';
    return 'bg-pastel-secondary';
  }

  private cargarEstadisticas(): void {
  const medicoId = this.usuarioService.usuarioLogueado.id;
  this.loadingStats = true;    // inicio carga

  forkJoin({
    perfil: this.usuarioService.getPerfilUsuario(medicoId),
    stats:  this.statsSvc.getEstadisticas(medicoId)
  }).subscribe({
    next: ({ perfil, stats }) => {
      // procesar perfil
      if ((perfil as any).foto_perfil?.data) {
        perfil.foto_perfil = this.bufferToBase64((perfil as any).foto_perfil);
      }
      this.perfilUsuario = perfil;

      // procesar stats
      this.stats = stats;
      const avg = parseFloat(stats.avgRating as any);
      this.stars = Array.from({ length: 5 }, (_, i) => {
        if (avg >= i + 1) return 'full';
        if (avg >= i + 0.5) return 'half';
        return 'empty';
      });

      this.loadingStats = false;  // fin carga
    },
    error: err => {
      console.error('Error al cargar estadísticas', err);
      this.loadingStats = false;  // fin carga aun con error
    }
  });
}

  // Convierte Buffer → base64
  private bufferToBase64(buf: { data: number[] }): string {
    const bytes = new Uint8Array(buf.data);
    let binary = '';
    bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary);
  }

  // Genera estrellas para cada comentario
  getStarsForRating(rating: number): ('full'|'half'|'empty')[] {
    const r = +rating;
    return Array.from({ length: 5 }, (_, i) => {
      if (r >= i + 1)   return 'full';
      if (r >= i + 0.5) return 'half';
      return 'empty';
    });
  }
}
