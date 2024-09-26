import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { User } from 'src/app/entidades/usuario';
import { Perfil } from 'src/app/entidades/usuario';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule,],
})
export class PerfilComponent implements OnInit {
  public usuario: User | null = null;
  public perfil: Perfil | null = null;
  public edad: number | null = null;
  constructor(private usuarioService: UsuarioService, private http: HttpClient) {}

  ngOnInit(): void {
    this.usuario = this.usuarioService.getUsuarioLogueado();
    if (this.usuario) {
      this.usuarioService.getPerfilUsuario(this.usuario.id).subscribe(
        (data) => {
          this.perfil = data;
        //  this.calcularEdad(); // Calcular edad al obtener perfil
          console.log('Perfil del usuario:', this.perfil); // Mostrar datos en consola
        },
        (error) => {
          console.error('Error al obtener el perfil:', error);
        }
      );
    }
  }


  verFichaMedico() {
    // Lógica para redirigir a la ficha médica
  }
}