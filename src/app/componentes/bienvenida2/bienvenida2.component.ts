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
  fechaInicioSemana = '01-06-2024'; 
  fechaFinSemana = '07-06-2024'; 
  horasDisponibles: string[] = [];
  horariosSeleccionados: string[] = [];
  
  constructor(private http: HttpClient, public usuarioService: UsuarioService, private especialidadService: EspecialidadService, private medicoService: MedicoService ) {}

  ngOnInit(): void {
    this.usuario = this.usuarioService.getUsuarioLogueado();
    this.obtenerEspecialidadesMedico();
    this.generarHorariosDisponibles();
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

  generarHorariosDisponibles() {
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
        
      },
      (error: any) => {
        console.error('Error al crear turnos:', error);
      }
    );
  }

  /*calcularHoraFin(horaInicio: string): string {
    // Convertir la hora de inicio a minutos
    const [hh, mm] = horaInicio.split(':').map(Number);
    const horaInicioMinutos = hh * 60 + mm;
  
    // Sumar 20 minutos al tiempo de inicio en minutos
    const horaFinMinutos = horaInicioMinutos + 20;
  
    // Calcular las horas y minutos para la hora de fin
    const hhFin = Math.floor(horaFinMinutos / 60);
    const mmFin = horaFinMinutos % 60;
  
    // Formatear la hora de fin en el formato HH:mm
    const horaFin = `${hhFin.toString().padStart(2, '0')}:${mmFin.toString().padStart(2, '0')}`;
  
    return horaFin;
  }*/

  obtenerTurno(dia: string, hora: string): string {
    return `${hora}`;
  }

  semanaAnterior() {
   
  }

  semanaSiguiente() {
    
  }
}
