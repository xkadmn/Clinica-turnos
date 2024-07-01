
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Especialidad } from 'src/app/entidades/medico';
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
  turno = {
    fecha: '',
    horaInicio: '',
    horaFin: '',
    especialidadId: null
  };
  horas = ['08:00', '08:20', '08:40', '09:00', '09:20', '09:40', '10:00']; 
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  fechaInicioSemana = '01-06-2024'; 
  fechaFinSemana = '07-06-2024'; 
  horasDisponibles: string[] = [];
  horarioSeleccionado: string = '';
  
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

  mostrarHorariosDisponibles() {
    // lógica 
  }

  seleccionarHorario(hora: string) {
    this.horarioSeleccionado = hora;
  }
  habilitarTurno() {
  
    const usuarioMedicoId = this.usuario.id;
    const turno = {
        usuarioMedicoId: usuarioMedicoId,
        especialidadId: this.turno.especialidadId,
        fecha: this.turno.fecha,
        hora: this.horarioSeleccionado,
        disponible: 1 
    };

    console.log('Datos a enviar:', turno);

    this.medicoService.habilitarTurnos(turno).subscribe(
        (response: any) => {
            console.log('Turno habilitado:', response);
            
        },
        (error: any) => {
            console.error('Error al habilitar turno:', error);
        }
    );
}
  obtenerTurno(dia: string, hora: string): string {
    return `${hora}`;
  }

  semanaAnterior() {
   
  }

  semanaSiguiente() {
   
  }
  }

