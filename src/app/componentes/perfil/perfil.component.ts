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
  public isEditing: boolean = false; // Estado de edición
  public mostrarOpciones: boolean = false; // Estado del menú desplegable
  public modalTipo: string | null = null; // Para determinar qué modal mostrar
  public nuevaContrasena: string = ''; // Nueva contraseña a establecer
  public mensajeError: string | null = null; // Mensaje de error
  public datosFaltantes: boolean = false; // Nueva variable para indicar si hay datos faltantes
  public mensajeExito: string | null = null;
  constructor(private usuarioService: UsuarioService, private http: HttpClient) {}

  ngOnInit(): void {
    this.usuario = this.usuarioService.getUsuarioLogueado();
    if (this.usuario) {
      this.usuarioService.getPerfilUsuario(this.usuario.id).subscribe(
        (data) => {
          this.perfil = data;
          this.verificarDatosFaltantes(); // Verificar datos al cargar el perfil
          this.cargarPerfil(); 
        },
        (error) => {
          console.error('Error al obtener el perfil:', error);
        }
      );
    }
  }
  public isTipoUsuario2(): boolean {
    return this.usuario !== null && this.usuario.tipo === '2'; // Asegura que el resultado sea siempre booleano
  }

  cargarPerfil() {
    if (this.usuario && this.usuario.id) {
    this.usuarioService.getPerfilUsuario(this.usuario.id).subscribe(
      (data) => {
        this.perfil = data;
        this.verificarDatosFaltantes(); 
      },
      (error) => {
        console.error('Error al obtener el perfil:', error);
      }
    );
  }
  }
  
  verificarDatosFaltantes() {
    if (this.perfil) {
      const { telefono1, telefono2, direccion, localidad, nacionalidad, documento_tipo, documento_id } = this.perfil;
      this.datosFaltantes = !(telefono1 && telefono2 && direccion && localidad && nacionalidad && documento_tipo && documento_id);
    } else {
      this.datosFaltantes = true; // Si no hay perfil, consideramos que hay datos faltantes
    }
  }
  validarPerfilCompleto(): boolean {
    if (this.perfil) {
      const { telefono1, telefono2, direccion, localidad, nacionalidad, documento_tipo, documento_id } = this.perfil;
      return !!(telefono1 && telefono2 && direccion && localidad && nacionalidad && documento_tipo && documento_id);
    }
    return false;
  }
  toggleOpciones(event: MouseEvent) {
    event.stopPropagation(); // Prevenir que el clic cierre el menú
    this.mostrarOpciones = !this.mostrarOpciones;
  }
  

  editarPerfil(event: MouseEvent) {
    event.stopPropagation();
    this.isEditing = !this.isEditing;
  }
  guardarCambios(event: MouseEvent) {
    event.stopPropagation(); // Prevenir que el clic cierre el menú
    if (this.perfil && this.perfil.id) {
      this.usuarioService.actualizarPerfil(this.perfil).subscribe(
        () => {
          this.isEditing = false;
          this.mensajeExito = 'Perfil actualizado exitosamente!'; 
  
          // Ocultar el mensaje después de 2 segundos
          setTimeout(() => {
            this.mensajeExito = null; 
          }, 2000);
          
          this.cargarPerfil(); 
        },
        (error) => {
          console.error('Error al actualizar el perfil:', error);
          this.mensajeError = 'Error al actualizar el perfil. Intente nuevamente.';
        }
      );
    } else {
      console.error('El perfil no tiene un ID válido:', this.perfil);
    }
  }
  

  
  

  abrirModal(tipo: string, event: MouseEvent) {
    this.modalTipo = tipo;
    event.stopPropagation();
  }

  cerrarModal() {
    this.modalTipo = null;
    this.mensajeError = null; // Resetear mensaje de error al cerrar el modal
    this.mensajeExito = null;
  }

  guardarContrasena() {
    // Validar que la nueva contraseña no esté vacía
    if (!this.nuevaContrasena) {
      this.mensajeError = 'Faltan datos por completar.';
      return;
    }
  
    // Asegurarse de que usuario no sea null
    if (this.usuario) {
      this.usuarioService.cambiarContrasena(this.usuario.id, this.nuevaContrasena).subscribe(
        (response) => {
          this.cerrarModal(); // Cerrar modal después de guardar
          this.nuevaContrasena = ''; // Limpiar el campo
        },
        (error) => {
          console.error('Error al cambiar la contraseña:', error);
        }
      );
    } else {
      this.mensajeError = 'Usuario no encontrado. Por favor, inicie sesión de nuevo.';
    }
  }
  
}