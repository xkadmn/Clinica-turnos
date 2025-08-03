import { Component, OnInit } from '@angular/core';
import { EspecialidadService } from 'src/app/servicios/especialidad.service';
import { EstadisticasService }    from 'src/app/servicios/estadisticas.service'; 
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

  constructor(private especialidadService: EspecialidadService, private statsSvc: EstadisticasService, private router: Router) {}

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
    this.especialidadService.getMedicosPorEspecialidad(especialidadId)
      .subscribe(
        medicos => {
          this.medicos = medicos;

          // Por cada médico, pedimos sus stats y calculamos las estrellas
          this.medicos.forEach(m => {
            this.statsSvc.getEstadisticas(m.medico_id)  // o m.id según tu API
              .subscribe(stats => {
                const avg = parseFloat(stats.avgRating as any);

                // Guardamos avgRating y totalRatings en el objeto
                m.avgRating    = avg;
                m.totalRatings = stats.totalRatings;

                // Creamos un array de 5 posiciones con 'full' | 'half' | 'empty'
                m.stars = Array.from({ length: 5 }, (_, i) => {
                  if (avg >= i + 1)      return 'full';
                  if (avg >= i + 0.5)    return 'half';
                  return 'empty';
                });
              });
          });
        },
        err => console.error('Error cargando médicos:', err)
      );
  }

  verAgenda(medicoId: number) {
    this.router.navigate(['/principal/agenda-medico', medicoId, { especialidadId: this.selectedEspecialidadId }]);
}

volver() {
  this.router.navigate(['principal/bienvenida']); // Cambia a la ruta correspondiente
}
}

