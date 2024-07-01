import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EspecialidadService } from 'src/app/servicios/especialidad.service';

import { Medico,  Especialidad } from 'src/app/entidades/medico'; // Ajusta la ruta según la ubicación real en tu proyecto


@Component({
  selector: 'app-pedir-turno',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css'],
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule,  HttpClientModule],
})
export class PedirTurnoComponent implements OnInit {
  especialidades: Especialidad[] = [];
  selectedEspecialidad: number | null = null;
  medicos: Medico[] = [];

  constructor(private especialidadService: EspecialidadService) {}

  ngOnInit(): void {
    this.getEspecialidades();
  }

  getEspecialidades(): void {
    this.especialidadService.getEspecialidades().subscribe(
      (data: Especialidad[]) => {
        console.log('Especialidades cargadas en el componente:', data);
        this.especialidades = data;
      },
      error => {
        console.error('Error al cargar especialidades en el componente:', error);
      }
    );
  }

  listarMedicos(): void {
    if (!this.selectedEspecialidad) {
      console.error('Debe seleccionar una especialidad');
      return;
    }
  
    this.especialidadService.getMedicosPorEspecialidad(this.selectedEspecialidad).subscribe(
      (data: Medico[]) => {
        console.log('Médicos cargados por especialidad:', data);
  
        // Verificar si data es un array y no está vacío
        if (Array.isArray(data) && data.length > 0) {
          this.medicos = data.map(medico => ({
            id: medico.id,
            user: {
              id: medico.user?.id, // Asegúrate de que user también esté definido
              nombre: medico.user?.nombre,
              apellido: medico.user?.apellido,
              usuario: medico.user?.usuario,
              tipo: medico.user?.tipo,
              aprobado: medico.user?.aprobado
            },
            numeroRegistroMedico: medico.numeroRegistroMedico,
            aprobado: medico.aprobado,
            fechaCreacion: medico.fechaCreacion,
            fechaModificacion: medico.fechaModificacion,
            especialidades: medico.especialidades,
            proximoTurno: this.calcularProximoTurno(medico)
          }));
  
          // Ordenar por próximo turno disponible
          this.medicos.sort((a, b) => {
            if (!a.proximoTurno && !b.proximoTurno) return 0;
            if (!a.proximoTurno) return 1;
            if (!b.proximoTurno) return -1;
            return a.proximoTurno.getTime() - b.proximoTurno.getTime();
          });
        } else {
          console.error('Error: La respuesta de la API no es un array válido o está vacío');
        }
      },
      error => {
        console.error('Error al cargar médicos por especialidad:', error);
      }
    );
  }
  

  calcularProximoTurno(medico: Medico): Date | null {
    // Implementar la lógica para calcular el próximo turno del médico
    // Puede retornar una fecha válida o null si no hay próximo turno
    return null; // Implementar la lógica real aquí
  }

  agendarTurno(medico: Medico): void {
    console.log('Agendar turno con el médico:', medico);
    // Implementar la lógica para agendar el turno con el médico seleccionado
  }

  verAgenda(medico: Medico): void {
    console.log('Ver agenda del médico:', medico);
    // Implementar la lógica para dirigir al usuario a la agenda del médico seleccionado
  }
}