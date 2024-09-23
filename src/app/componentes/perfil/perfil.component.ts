import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { User } from 'src/app/entidades/usuario';
import { Perfil } from 'src/app/entidades/usuario';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
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

 /* calcularEdad(): void {
    if (this.usuario?.fecNac) {
      const fechaNacimiento = new Date(this.usuario.fecNac);
      const hoy = new Date();
      this.edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const mes = hoy.getMonth() - fechaNacimiento.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        this.edad--; // Resta un año si no ha cumplido años este año
      }
      console.log('Edad calculada:', this.edad); // Agregar log para mostrar la edad calculada
    } else {
      this.edad = null; // Si no hay fecha de nacimiento, la edad es null
      console.log('No se puede calcular la edad, fecha de nacimiento no disponible.');
    }
  }*/
  verFichaMedico() {
    // Lógica para redirigir a la ficha médica
  }
}