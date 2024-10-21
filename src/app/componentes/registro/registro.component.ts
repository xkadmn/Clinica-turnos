import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario.service';
import { User, Perfil } from '../../entidades/usuario';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EspecialidadService } from '../../servicios/especialidad.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})


export class RegistroComponent {
  usuario: User = {
    id: 0,
    nombre: '',
    apellido: '',
    usuario: '',
    pass: '',
    mail: '',
    tipo: '',
    fecnac: '',
    aprobado: false,
  };
  pass2: string = '';
  perfilVisible: boolean = false;
  fichaMedicaVisible: boolean = false;
  listaEspecialidades: any[] = [];
  perfil: Perfil = {
    telefono1: '',
    telefono2: '',
    direccion: '',
    localidad: '',
    nacionalidad: '',
    mail: this.usuario.mail,
    documento_tipo: '',
    documento_id: '',
    foto_perfil: null
};

  fichaMedica = {
    experiencia: '',
    certificaciones: '',
    idiomas: '',
    area_atencion: ''
  };
  especialidades: string[] = [];
  especialidadesVisible: boolean = false;

  constructor(private router: Router, private usuarioService: UsuarioService, private especialidadService: EspecialidadService ) {}
 
  
  ngOnInit() {
   /* this.especialidadService.getEspecialidades().subscribe(
      (especialidades) => {
        this.listaEspecialidades = especialidades; 
      },
      (error) => {
        console.error('Error al obtener especialidades:', error);
      }
    );*/
  }
  
  onTipoChange() {
    this.perfilVisible = false;
    this.fichaMedicaVisible = false;
  }

  nextSection() {
    if (!this.perfil.telefono1 || !this.perfil.direccion || !this.perfil.localidad || !this.perfil.nacionalidad || !this.perfil.documento_tipo || !this.perfil.documento_id) {
      alert('Por favor, completa todos los campos obligatorios.');
      return; // Detener la ejecución si faltan campos
  }
    this.registrarPerfil();  // Llama al método para registrar el perfil
    if (this.perfilVisible) {
      this.fichaMedicaVisible = true; // Muestra la sección de ficha médica
      this.perfilVisible = false; // Oculta la sección de perfil
    }
  }

  
  registrarUsuario() {
    if (this.usuario.pass !== this.pass2) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.usuarioService.registrarUsuario(this.usuario).subscribe(
      (response) => {
        alert('Usuario registrado exitosamente');
        this.usuario.id = response.id;
        this.perfilVisible = true; // Muestra la sección del perfil después del registro
      },
      (error) => {
        console.error('Error al registrar el usuario', error);
        alert('Error al registrar. Intente nuevamente.');
      }
    );
  }

  registrarPerfil() {
    this.perfil.mail = this.usuario.mail;
    this.perfil.id = this.usuario.id;
    console.log('Datos del perfil a enviar:', JSON.stringify(this.perfil, null, 2));
    

    this.usuarioService.registrarPerfil(this.usuario.id, this.perfil).subscribe(
      
        (response) => {
            alert('Perfil registrado exitosamente');
            this.perfilVisible = false; 
        },
        (error) => {
            console.error('Error al registrar el perfil', error);
            alert('Error al registrar el perfil. Intente nuevamente.');
        }
    );
}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.perfil.foto_perfil = e.target.result; // Guardar la foto en el objeto perfil
      };
      reader.readAsDataURL(file); // Leer el archivo como URL de datos
    }
  }

  prevSection(section: string) {
    if (section === 'fichaMedica') {
      this.fichaMedicaVisible = false; // Oculta la sección de ficha médica
      this.perfilVisible = true; // Muestra la sección de perfil
    }
  }
  
  
  

  
}
