import { Component, OnInit } from '@angular/core';
import { EspecialidadService } from 'src/app/servicios/especialidad.service';
import { Especialidad } from 'src/app/entidades/medico';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pedir-turno',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class PedirTurnoComponent implements OnInit {
  especialidades: Especialidad[] = [];
  medicos: any[] = [];
  selectedEspecialidadId: number | null = null;

  constructor(private especialidadService: EspecialidadService,  private router: Router) {}

  ngOnInit(): void {
    this.cargarEspecialidades();
  }

  cargarEspecialidades() {
    this.especialidadService.getEspecialidades().subscribe(
      (data) => {
        this.especialidades = data;
      },
      (error) => {
        console.error('Error al cargar especialidades', error);
      }
    );
  }

  onEspecialidadChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const especialidadId = selectElement.value ? Number(selectElement.value) : null;
  
    if (especialidadId !== null && !isNaN(especialidadId)) {
      this.selectedEspecialidadId = especialidadId;
      this.cargarMedicosPorEspecialidad(especialidadId);
    } else {
      
      this.selectedEspecialidadId = null;
      this.medicos = [];
    }
  }
  cargarMedicosPorEspecialidad(especialidadId: number) {
    this.especialidadService.getMedicosPorEspecialidad(especialidadId).subscribe(
      (data) => {
        this.medicos = data;
        console.log('Médicos cargados:', this.medicos); // Agrega este log para verificar
      },
      (error) => {
        console.error('Error al cargar médicos', error);
      }
    );
  }

  verAgenda(medicoId: number) {
    this.router.navigate(['/principal/agenda-medico', medicoId, { especialidadId: this.selectedEspecialidadId }]);
}

volver() {
  this.router.navigate(['principal/bienvenida']); // Cambia a la ruta correspondiente
}
}

