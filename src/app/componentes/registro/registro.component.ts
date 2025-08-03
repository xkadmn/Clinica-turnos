import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario.service';
import { EspecialidadService } from '../../servicios/especialidad.service';
import { LocalidadService, Localidad } from '../../servicios/localidad.service';
import { User, Perfil } from '../../entidades/usuario';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class RegistroComponent implements OnInit {
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
  pass2 = '';
  perfilVisible = false;
  fichaMedicaVisible = false;

  listaLocalidades: Localidad[] = [];
  listaNacionalidades = [
    'Argentina', 'Brasil', 'Chile',
    'Uruguay', 'Paraguay', 'Bolivia'
  ];

  perfil: Perfil = {
    telefono1: 0,
    telefono2: 0,
    direccion: '',
    localidad: '',
    nacionalidad: '',
    mail: this.usuario.mail,
    documento_tipo: '',
    documento_id: '',
    foto_perfil: null,
    legajo_id: 0,       // ← agregar
    obraSocial: ''       // ← agregar
  };

  fichaMedica = {
    experiencia: '',
    certificaciones: '',
    idiomas: '',
    area_atencion: ''
  };
  archivoSeleccionado: File | null = null;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private especialidadService: EspecialidadService,
    private localidadService: LocalidadService
  ) {}

  ngOnInit() {
    // Cargo el listado de localidades una sola vez
    this.localidadService.getLocalidades().subscribe(
      data => this.listaLocalidades = data,
      err => console.error('Error al cargar localidades:', err)
    );
  }

  // --------------------
  // 1) Validaciones Usuario
  // --------------------

  /** Sólo letras A–Z/a–z, sin espacios ni números */
  private validarNombre(valor: string): boolean {
    return /^[A-Za-z ]+$/.test(valor);
  }

  private validarApellido(valor: string): boolean {
    return /^[A-Za-z ]+$/.test(valor.trim());
  }

  /** Email básico: algo@algo.algo */
  private validarEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /** No permite fechas futuras */
  private validarFechaNacimiento(fechaStr: string): boolean {
    const fecha = new Date(fechaStr);
    return fecha <= new Date();
  }

  /**
   * 8–20 caracteres, al menos 1 mayúscula, 1 número,
   * 1 carácter especial, sin espacios ni emojis
   */
  private validarPassword(pass: string): boolean {
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!""#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!""#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,20}$/;
    return regex.test(pass);
  }

  registrarUsuario() {
    // Validaciones de usuario
    if (!this.validarNombre(this.usuario.nombre)) {
      alert('El nombre sólo puede contener letras.');
      return;
    }
    if (!this.validarNombre(this.usuario.apellido)) {
      alert('El apellido sólo puede contener letras.');
      return;
    }
    if (!this.validarEmail(this.usuario.mail)) {
      alert('E-mail inválido.');
      return;
    }
    if (!this.validarFechaNacimiento(this.usuario.fecnac)) {
      alert('Fecha de nacimiento no puede ser futura.');
      return;
    }
     if (!this.usuario.tipo) {
    alert('Por favor, selecciona un tipo de usuario.');
    return;
    }
    if (!this.validarPassword(this.usuario.pass)) {
      alert('La contraseña debe cumplir los requisitos.');
      return;
    }
    if (this.usuario.pass !== this.pass2) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    // Registro de usuario
    this.usuarioService.registrarUsuario(this.usuario).subscribe({
      next: resp => {
        alert('Usuario registrado exitosamente');
        this.usuario.id = resp.id;
        this.perfil.mail = this.usuario.mail;
        this.perfilVisible = true;
      },
      error: err => {
        console.error(err);
        alert('Error al registrar usuario.');
      }
    });
  }

  // --------------------
  // 2) Validaciones Perfil
  // --------------------

  /** Sólo dígitos, 8–15 caracteres */
  private validarTelefono(tel: number): boolean {
    return /^[0-9]{8,15}$/.test(tel.toString());
  }
  /** Debe existir en listaLocalidades */
  private validarLocalidad(loc: string): boolean {
    return this.listaLocalidades.some(l => l.nombre === loc);
  }
  /** Debe estar en listaNacionalidades */
  private validarNacionalidad(nac: string): boolean {
    return this.listaNacionalidades.includes(nac);
  }

  nextSection() {
    // Validación de campos obligatorios de perfil
    if (
      !this.perfil.telefono1 ||
      !this.perfil.direccion ||
      !this.perfil.localidad ||
      !this.perfil.nacionalidad ||
      !this.perfil.documento_tipo ||
      !this.perfil.documento_id
    ) {
      alert('Completa todos los campos de perfil.');
      return;
    }
    // Validación específica
    if (!this.validarTelefono(this.perfil.telefono1)) {
      alert('Teléfono 1 inválido.');
      return;
    }
    if (this.perfil.telefono2 && !this.validarTelefono(this.perfil.telefono2)) {
      alert('Teléfono 2 inválido.');
      return;
    }
    if (!this.validarLocalidad(this.perfil.localidad)) {
      alert('Localidad no está en el listado.');
      return;
    }
    if (!this.validarNacionalidad(this.perfil.nacionalidad)) {
      alert('Nacionalidad no válida.');
      return;
    }
      const tipo = this.perfil.documento_tipo;

    if (!['dni', 'cuit', 'pasaporte'].includes(tipo)) {
      alert('Selecciona un tipo de documento válido.');
      return;
    }

    const numero = this.perfil.documento_id;
    if (!/^\d+$/.test(numero)) {
      alert('El número de documento debe contener solo dígitos.');
      return;
    }

    switch (tipo) {
      case 'dni':
        if (!/^\d{7,8}$/.test(numero)) {
          alert('DNI inválido: debe tener 7 u 8 dígitos.');
          return;
        }
        break;
      case 'cuit':
        if (!/^\d{11}$/.test(numero)) {
          alert('CUIT inválido: debe tener 11 dígitos.');
          return;
        }
        break;
      case 'pasaporte':
        if (!/^\d{9}$/.test(numero)) {
          alert('Pasaporte inválido: debe tener 9 dígitos.');
          return;
        }
        break;
    }

    this.registrarPerfil();
  }

registrarPerfil() {
  this.perfil.id = this.usuario.id;

  const fd = new FormData();
  const perfilCompleto = {
    ...this.perfil,
    legajo_id: this.perfil.legajo_id || null,
    obraSocial: this.perfil.obraSocial || null,
  };

  fd.append('perfil', JSON.stringify(perfilCompleto));

  const fileInput = document.getElementById('foto_perfil') as HTMLInputElement;
  if (fileInput?.files && fileInput.files[0]) {
    fd.append('foto_perfil', fileInput.files[0], fileInput.files[0].name);
  }


  this.usuarioService.registrarPerfil(this.usuario.id, fd).subscribe({
    next: () => {
      alert('Perfil registrado exitosamente');
      this.perfilVisible = false;
      this.fichaMedicaVisible = true;
      this.router.navigateByUrl('/principal/login');
    },
    error: e => {
      console.error(e);
      alert('Error al guardar perfil.');
    }
  });
}

  /** Oculta perfiles al cambiar tipo de usuario */
  onTipoChange() {
    this.perfilVisible = false;
    this.fichaMedicaVisible = false;
  }

  /** Retrocede de ficha médica a perfil */
  prevSection(section: string) {
    if (section === 'fichaMedica') {
      this.fichaMedicaVisible = false;
      this.perfilVisible = true;
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
    }
  }
}
