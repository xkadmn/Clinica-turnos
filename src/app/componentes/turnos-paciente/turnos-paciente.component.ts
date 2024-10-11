import { Component, OnInit } from '@angular/core';
import { TurnoService } from 'src/app/servicios/turno.service'; 
import { UsuarioService } from 'src/app/servicios/usuario.service'; 
import { Turno } from 'src/app/entidades/medico';
import { Router } from '@angular/router';
@Component({
  selector: 'app-turnos-paciente',
  templateUrl: './turnos-paciente.component.html',
  styleUrls: ['./turnos-paciente.component.css']
})
export class TurnosPacienteComponent implements OnInit {
  public turnos: Turno[] = [];

  constructor(private TurnoService: TurnoService, private usuarioService: UsuarioService,  private router: Router) {}

  ngOnInit(): void {
    const pacienteId = this.usuarioService.usuarioLogueado.id;
    this.TurnoService.getTurnosPorPaciente(pacienteId).subscribe(turnos => {
      this.turnos = turnos.map(turno => ({
        ...turno,// Copia todas las propiedades de `turno`
        hora: turno.hora.substring(0, 5) // Extrae solo HH:mm
      }));
    });
  }
  volver() {
    this.router.navigate(['principal/bienvenida']); // Cambia a la ruta correspondiente
  }
}
