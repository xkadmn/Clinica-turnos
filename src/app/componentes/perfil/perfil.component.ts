import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { User } from 'src/app/entidades/usuario';
import { Perfil } from 'src/app/entidades/usuario';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BufferToBase64Pipe } from 'src/app/pipes/buffer-to-base64.pipe';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, BufferToBase64Pipe ],
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
  public fotoPerfilPreview: string | null = null;
  public archivoSeleccionado: File | null = null;
  public contrasenaActual: string = '';

  constructor(private usuarioService: UsuarioService, private http: HttpClient) {}

   get edad(): number {
    const fecha = this.usuario?.fecnac;
    if (!this.usuario?.fecnac) return 0;
     const nacimiento = new Date(this.usuario.fecnac);
    const hoy = new Date();
    let años = hoy.getFullYear() - nacimiento.getFullYear();
    const pasóCumple =
      hoy.getMonth()  > nacimiento.getMonth() ||
      (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() >= nacimiento.getDate());
    return pasóCumple ? años : años - 1;
  }

  onFileSelected(event: Event) {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files[0]) {
    this.archivoSeleccionado = fileInput.files[0];

    // Mostrar preview inmediata
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.fotoPerfilPreview = e.target.result;
    };
    reader.readAsDataURL(this.archivoSeleccionado);
  }
  }


   ngOnInit(): void {
    this.usuario = this.usuarioService.getUsuarioLogueado();
    if (!this.usuario) return;

    this.usuarioService.getPerfilUsuario(this.usuario.id).subscribe(
      (data: any) => {
        this.perfil = data;
        this.usuario!.mail  = data.mail;
        this.usuario!.fecnac = data.fecnac; 
         if (data.foto_perfil) {this.fotoPerfilPreview = 'data:image/jpeg;base64,' + data.foto_perfil;}
        this.verificarDatosFaltantes();
      },
      (err) => console.error(err)
    );
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
  event.stopPropagation();
  if (!this.perfil?.id) return;

  // Clon simple reemplazando undefined → null
  const perfilClonado = JSON.parse(
    JSON.stringify(this.perfil, (_key, value) => value === undefined ? null : value)
  );

  // Siempre usar FormData
  const fd = new FormData();
  fd.append('perfil', JSON.stringify(perfilClonado));

  // Solo agregamos la foto si existe
  if (this.archivoSeleccionado) {
    fd.append('foto_perfil', this.archivoSeleccionado, this.archivoSeleccionado.name);
  }

  // Llamamos al mismo método siempre
  this.usuarioService.actualizarPerfilConFoto(fd).subscribe({
    next: () => {
      this.isEditing = false;
      this.mensajeExito = 'Perfil actualizado exitosamente';
      this.archivoSeleccionado = null;
      this.fotoPerfilPreview = null;
      this.cargarPerfil();
      setTimeout(() => this.mensajeExito = null, 2000);
    },
    error: (err) => {
      console.error('Error al actualizar el perfil:', err);
      this.mensajeError = 'No se pudo actualizar. Intentá de nuevo.';
    }
  });
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

  guardarObraSocial() {
    if (!this.perfil || !this.perfil.obraSocial) return;

    this.usuarioService.actualizarObraSocial(this.usuario!.id, this.perfil.obraSocial)
      .subscribe({
        next: () => {
          this.mensajeExito = 'Obra social actualizada';
          this.cerrarModal();
          this.cargarPerfil();
          setTimeout(() => this.mensajeExito = null, 2000);
        },
        error: (err) => {
          console.error('Error al actualizar obra social:', err);
          this.mensajeError = 'Error al actualizar obra social';
        }
      });
  }

  private validarPassword(pass: string): boolean {
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!""#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!""#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,20}$/;
    return regex.test(pass);
  }


  // Extiende guardarContrasena para validar la anterior
  guardarContrasena(event: MouseEvent) {
    event.stopPropagation();

    if (!this.nuevaContrasena || !this.contrasenaActual) {
      this.mensajeError = 'Completa ambos campos.';
      return;
    }

    if (!this.validarPassword(this.nuevaContrasena)) {
      this.mensajeError = 'La nueva contraseña no cumple con los requisitos.';
      return;
    }

    this.usuarioService
      .cambiarContrasena(this.usuario!.id, this.contrasenaActual, this.nuevaContrasena)
      .subscribe({
        next: () => {
          this.mensajeError = null;
          this.mensajeExito = 'Contraseña actualizada correctamente';
          this.contrasenaActual = '';
          this.nuevaContrasena = '';
          this.modalTipo = null;
          this.mostrarOpciones = false;  
          setTimeout(() => {
            this.mensajeExito = null;
          }, 2500);
        },
        error: (err) => {
          this.mensajeError = err.status === 401
            ? 'Contraseña actual incorrecta'
            : 'Error al actualizar contraseña';
          this.modalTipo = 'cambiarContrasena';
          this.mostrarOpciones = true; 
        }
      });
  }
}