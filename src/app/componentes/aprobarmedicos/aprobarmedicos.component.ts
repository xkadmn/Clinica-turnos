import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';  // Ajusta la ruta según tu estructura
import { User } from 'src/app/entidades/usuario';
@Component({
  selector: 'app-aprobarmedicos',
  templateUrl: './aprobarmedicos.component.html',
  styleUrls: ['./aprobarmedicos.component.css']
})
export class AprobarmedicosComponent implements OnInit {
  medicosNoAprobados: User[] = [];

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.getMedicosNoAprobados();
  }

  getMedicosNoAprobados() {
    this.usuarioService.getMedicosNoAprobados().subscribe(
      (data: User[]) => {
        this.medicosNoAprobados = data;
      },
      error => {
        console.log('Error al obtener médicos no aprobados:', error);
      }
    );
  }

  verFicha(usuarioId: number) {
    // Implementa lógica para ver la ficha del usuario con el ID proporcionado
    // console.log(`Ver ficha del usuario con ID ${usuarioId}`);
  }

  aprobarMedico(usuarioId: number) {
    this.usuarioService.aprobarMedico(usuarioId).subscribe(
      () => {
        // Actualizar la lista de médicos no aprobados después de aprobar uno
        this.medicosNoAprobados = this.medicosNoAprobados.filter(usuario => usuario.id !== usuarioId);
      },
      error => {
        console.log(`Error al aprobar usuario con ID ${usuarioId}:`, error);
      }
    );
  }
}