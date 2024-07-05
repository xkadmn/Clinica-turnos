// registro.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario.service';
import { User } from '../../entidades/usuario';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
    fecNac: new Date(),
    aprobado: false,
  };
  pass2: string = '';
  esMedico: boolean = false;
  fecNac: Date = new Date(); 
  
  constructor(private router: Router, private usuarioService: UsuarioService) {}

  /*validarExiste(): boolean {
    return this.usuarioService.listaUsuarios.some(u => u.usuario.toLowerCase() === this.usuario.usuario.toLowerCase());
  }*/


  registrar() {
    this.usuarioService.registrar(this.usuario).subscribe(
      () => {
        console.log('Usuario registrado correctamente 13');
        this.router.navigateByUrl('/principal/login');
      },
      (error) => {
        console.error('Error al registrar usuario 14:', error);
      }
    );
  }
}
