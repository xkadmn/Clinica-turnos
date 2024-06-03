import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import {  User } from '../../entidades/usuario';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, HttpClientModule],
})
export class RegistroComponent {
 
  public usuario: User = {nombre:'', pass:'', mail:'', usuario: ''};
  public pass2:string = '';

  constructor(private router:Router,private us:UsuarioService){
   
  }


  public validarExiste(){
    return this.us.listaUsuarios.filter( t=> t.nombre.toLowerCase() == this.usuario.nombre.toLowerCase()).length == 1;
  };
  
  
  public registrar(){
    this.us.listaUsuarios.push(this.usuario);
    localStorage.setItem('usuarios', JSON.stringify(this.us.listaUsuarios));
    this.us.listaUsuarios= JSON.parse( JSON.stringify(this.us.listaUsuarios));
    this.router.navigateByUrl('/principal');
  };



}
