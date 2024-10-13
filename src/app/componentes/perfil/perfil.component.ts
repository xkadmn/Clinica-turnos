import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { User } from 'src/app/entidades/usuario';
import { Perfil } from 'src/app/entidades/usuario';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
})
export class PerfilComponent implements OnInit {
  public usuario: User | null = null;
  public perfil: Perfil | null = null;
  public edad: number | null = null;
  public isEditing: boolean = false; // Estado de edición
  public mostrarFichaMedica: boolean = false; // Estado de la ficha médica
  public mostrarCambiarContrasena: boolean = false; // Estado del cambiar contraseña
  public nuevaContrasena: string = ''; // Nueva contraseña a establecer


  constructor(private usuarioService: UsuarioService, private http: HttpClient) {}

  ngOnInit(): void {
    this.usuario = this.usuarioService.getUsuarioLogueado();
    if (this.usuario) {
      this.usuarioService.getPerfilUsuario(this.usuario.id).subscribe(
        (data) => {
          this.perfil = data;
        },
        (error) => {
          console.error('Error al obtener el perfil:', error);
        }
      );
    }
  }

  editarPerfil() {
    this.isEditing = !this.isEditing;
  }

  guardarCambios() {
    if (this.perfil) {
      this.usuarioService.actualizarPerfil(this.perfil).subscribe(
        (response) => {
          this.isEditing = false;
          this.perfil = response;
        },
        (error) => {
          console.error('Error al actualizar el perfil:', error);
        }
      );
    }
  }

  toggleDropdown(seccion: string) {
    if (seccion === 'fichaMedica') {
      this.mostrarFichaMedica = !this.mostrarFichaMedica;
      this.mostrarCambiarContrasena = false; // Cerrar el dropdown de cambiar contraseña
    } else if (seccion === 'cambiarContrasena') {
      this.mostrarCambiarContrasena = !this.mostrarCambiarContrasena;
      this.mostrarFichaMedica = false; // Cerrar el dropdown de ficha médica
    }
  }

  verFichaMedico() {
    // Lógica para redirigir a la ficha médica o abrir un modal
    console.log('Ver Ficha Médica');
  }

  guardarContrasena() {
   
  }
}