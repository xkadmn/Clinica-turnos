import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Especialidad, Turno } from 'src/app/entidades/medico';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from 'src/app/servicios/usuario.service'; 
import { EspecialidadService } from 'src/app/servicios/especialidad.service'; 
import { MedicoService } from 'src/app/servicios/medico.service';


@Component({
  selector: 'app-bienvenida2',
  templateUrl: './bienvenida2.component.html',
  styleUrls: ['bienvenida2.component.css'],
  standalone: true,
  imports: [RouterModule, FormsModule, HttpClientModule, CommonModule],
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
  turnos: Turno[] = [];
  horasDisponibles: string[] = [];
  horariosSeleccionados: string[] = [];
  turnoMes: any = {
    especialidadId: 0,
    mes: '', 
  };
  diasSeleccionados: string[] = [];
  
  constructor(private http: HttpClient, public usuarioService: UsuarioService, private especialidadService: EspecialidadService, private medicoService: MedicoService ) {}

  ngOnInit(): void {
    this.usuario = this.usuarioService.getUsuarioLogueado();
    this.obtenerEspecialidadesMedico();
    this.generarHorariosDisponibles();
    this.calcularFechasSemanaActual();
    this.cargarTurnos();
  }

  mostrarSeccion(seccion: string) {
    this.seccionActual = seccion;
    if (this.seccionActual === 'agenda') {
      this.cargarTurnos(); // Asegura que se carguen los turnos cuando cambiamos de subsección
    }
  }

  mostrarSubseccion(subseccion: string) {
    this.subseccionActual = subseccion;
    if (this.subseccionActual === 'calendario') {
      this.cargarTurnos(); // Asegura que se carguen los turnos cuando cambiamos de subsección
    }
  }

obtenerEspecialidadesMedico() {
  const medicoId = 4; // Asume un ID de médico específico para esta llamada
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
  const startDate = this.fechaInicioSemana.toISOString().split('T')[0];
  const endDate = this.fechaFinSemana.toISOString().split('T')[0];
  console.log('Solicitando turnos desde:', startDate, 'hasta:', endDate);

  this.http.get<Turno[]>(`https://hkoo-clinicaapi.mdbgo.io/api/verturnos?startDate=${startDate}&endDate=${endDate}`).subscribe(
    (data) => {
      console.log('Datos de turnos recibidos:', data);
      this.turnos = Array.isArray(data) ? data : [];
      this.ordenarTurnos(); // Ordena los turnos después de cargarlos
      console.log('Turnos cargados:', this.turnos); // Verifica que los turnos se cargan correctamente
    },
    (error) => {
      console.error('Error al obtener los turnos:', error);
    }
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
   calcularFechasSemanaActual() {
    const hoy = new Date();
    // Obtener el día de la semana actual (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
    const primerDiaSemana = hoy.getDate() - hoy.getDay() + (hoy.getDay() === 0 ? -6 : 1); // Si hoy es domingo, ajusta al lunes
    this.fechaInicioSemana = new Date(hoy.setDate(primerDiaSemana));
    this.fechaFinSemana = new Date(this.fechaInicioSemana);
    this.fechaFinSemana.setDate(this.fechaFinSemana.getDate() + 6); // Ajusta la fecha al final de la semana
  }





 // Método para calcular la fecha del primer día de la semana anterior
semanaAnterior() {
  const primerDiaSemana = new Date(this.fechaInicioSemana);
  primerDiaSemana.setDate(primerDiaSemana.getDate() - 7);
  this.fechaInicioSemana = primerDiaSemana;
  this.fechaFinSemana = new Date(primerDiaSemana);
  this.fechaFinSemana.setDate(this.fechaFinSemana.getDate() + 6);
  this.cargarTurnos();
}

// Método para calcular la fecha del primer día de la semana siguiente
semanaSiguiente() {
  const primerDiaSemana = new Date(this.fechaInicioSemana);
  primerDiaSemana.setDate(primerDiaSemana.getDate() + 7);
  this.fechaInicioSemana = primerDiaSemana;
  this.fechaFinSemana = new Date(primerDiaSemana);
  this.fechaFinSemana.setDate(this.fechaFinSemana.getDate() + 6);
  this.cargarTurnos();
}
}
