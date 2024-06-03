import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  User } from '../../entidades/usuario';
import { RouterModule, Router , Routes} from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule,  HttpClientModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public usuario: User = {nombre:'', pass:'', mail: '', usuario: '' };
  public listaUsuarios: User[] = []; 
    


  constructor(private router: Router, private usuarioservices:UsuarioService) { 

  if(usuarioservices.estoyLogueado()){
     this.router.navigateByUrl('/principal/bienvenida');
    }
  } //fin constructor


  public prueba(){
    this.usuarioservices.mostrarApi().subscribe(
      t=> this.probando = (<any>t).mensaje
    )
  }   public probando:string="";


  public login(){
  //   //cargar lista de us desde localstorage
  //  this.listaUsuarios = JSON.parse( localStorage.getItem('usuarios') || '[]');
  //   ///verificamos credenciales
  //   if(this.usuarioservices.listaUsuarios.filter( t => t.nombre.toLowerCase() == this.usuario.nombre.toLowerCase() 
  //     && t.pass == this.usuario.pass).length == 1)
  //   {
  //     ///guardar usuario logueado
  //     localStorage.setItem('usuarioLogueado', JSON.stringify(
  //       this.usuarioservices.listaUsuarios.filter( t=> t.nombre.toLowerCase() == 
  //       this.usuario.nombre.toLowerCase() && t.pass == this.usuario.pass)[0])
  //     )

     this.usuarioservices.loginenApi(this.usuario).subscribe(
      x=> {
        if((<User>x).usuario != null){
          this.usuarioservices.setLogueadoXapi(<User>x);
          ///pasar a la pagina principal segun tipo de usuario
          this.router.navigateByUrl('/principal/bienvenida');

        }
      }
     )
  
 

    
  };



  public logout() {
    this.usuarioservices.logout();
    this.router.navigateByUrl('/principal/login');
  };

 

}
