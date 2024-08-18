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
  styleUrls: ['./bienvenida2.component.css'],
  standalone: true,
  imports: [RouterModule, FormsModule, HttpClientModule, CommonModule],
})
export class Bienvenida2Component implements OnInit {

  usuario: any; 
  seccionActual: string = 'agenda';
  especialidades: Especialidad[] = [];
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
  horas = ['08:00', '08:20', '08:40', '09:00', '09:20', '09:40', '10:00']; 
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  fechaInicioSemana: Date = new Date(); 
  fechaFinSemana: Date = new Date();
  turnos: Turno[] = [];
  /*
  fechaInicioSemana = '01-06-2024'; 
  fechaFinSemana = '07-06-2024'; */
  horasDisponibles: string[] = [];
  horariosSeleccionados: string[] = [];
  

  
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
  }

  cargarEspecialidades() {
    this.http.get('/api/especialidades').subscribe((data: any) => {
      this.especialidades = data;
    });
  }

  obtenerEspecialidadesMedico() {
    const medicoId = 4; 
    this.especialidadService.obtenerEspecialidadesMedico(medicoId)
      .subscribe(
        especialidades => {
          this.especialidades = especialidades;
          console.log('Especialidades del médico:', especialidades);
        },
        error => {
          console.error('Error al obtener especialidades del médico:', error);
        }
      );
  }
/*
  generarHorariosDisponibles() {
    const horaInicio = 7 * 60; // 7:00 am en minutos
    const horaFin = 19 * 60 + 40; // 19:40 en minutos
    const intervalo = 20; // Intervalo de 20 minutos

    for (let i = horaInicio; i <= horaFin; i += intervalo) {
      const hora = `${Math.floor(i / 60).toString().padStart(2, '0')}:${(i % 60).toString().padStart(2, '0')}`;
      this.horasDisponibles.push(hora);
    }
  }*/

    generarHorariosDisponibles() {
      // Asegúrate de que los horarios disponibles se generen correctamente
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

 /*
  obtenerTurno(dia: string, hora: string): string {
    return `${hora}`;
  }*/
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
    const diaOffset = this.dias[dia]; // Usa 'this.dias' para acceder a la propiedad de la clase
    const fecha = new Date(this.fechaInicioSemana);
    fecha.setDate(fecha.getDate() + diaOffset);
    return fecha.toISOString().split('T')[0];
  }

   // Método para calcular el inicio y fin de la semana actual
   calcularFechasSemanaActual() {
    const hoy = new Date();
    const primerDiaSemana = hoy.getDate() - hoy.getDay() + 1; // Primer día de la semana (Lunes)
    this.fechaInicioSemana = new Date(hoy.setDate(primerDiaSemana));
    this.fechaFinSemana = new Date(hoy.setDate(primerDiaSemana + 6));
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

   // Método para obtener los turnos de la base de datos
  /* cargarTurnos() {
    const startDate = this.fechaInicioSemana.toISOString().split('T')[0];
    const endDate = this.fechaFinSemana.toISOString().split('T')[0];
    this.http.get<Turno[]>(`https://hkoo-clinicaapi.mdbgo.io/api/verturnos?startDate=${startDate}&endDate=${endDate}`).subscribe(
      (data) => {
        this.turnos = data;
      },
      (error) => {
        console.error('Error al obtener los turnos:', error);
      }
    );
  }*/
    cargarTurnos() {
      const startDate = this.fechaInicioSemana.toISOString().split('T')[0];
      const endDate = this.fechaFinSemana.toISOString().split('T')[0];
      console.log('Solicitando turnos desde:', startDate, 'hasta:', endDate);
    
      this.http.get<Turno[]>(`https://hkoo-clinicaapi.mdbgo.io/api/verturnos?startDate=${startDate}&endDate=${endDate}`).subscribe(
        (data) => {
          console.log('Datos recibidos:', data);
          if (Array.isArray(data)) {
            this.turnos = data;
          } else {
            console.warn('Datos recibidos no son un array:', data);
          }
        },
        (error) => {
          console.error('Error al obtener los turnos:', error);
        }
      );
    }

  // Obtener la visualización de los turnos en la agenda para un día y hora específicos
  obtenerTurno(dia: string, hora: string): string {
    const fecha = this.obtenerFechaPorDia(dia);
    const turno = this.turnos.find(turno => turno.fecha === fecha && turno.hora === hora);
    return turno ? 'Turno Habilitado' : '';
  }



 
}
