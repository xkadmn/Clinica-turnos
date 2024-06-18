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
  public usuario: User = {
    nombre: '',
    apellido: '',
    usuario: '',
    pass: '',
    mail: '',   // Asegúrate de que mail está aquí
    tipo: '',
    fecNac: new Date(),
  };        
  public listaUsuarios: User[] = []; 
    
  constructor(private router: Router, private usuarioservices: UsuarioService) { 
    if (this.usuarioservices.estoyLogueado()) {
      this.router.navigateByUrl('/principal/bienvenida');
    }
  }

  /*constructor(private router: Router, private usuarioservices:UsuarioService) { 

  if(usuarioservices.estoyLogueado()){
     this.router.navigateByUrl('/principal/bienvenida');
    }
  } //fin constructor*/




  
 /*public login(){
  console.log('Intentando loguear con:', this.usuario); // Log datos de usuario
     this.usuarioservices.loginenApi(this.usuario).subscribe(
      x=> {
        console.log('Respuesta de la API:', x); // Log respuesta de la API
        if((<User>x).usuario != null){
          this.usuarioservices.setLogueadoXapi(<User>x);
          
        const tipoUsuario = Number((<User>x).tipo);
        console.log('Tipo de usuario:', tipoUsuario);

        // Pasar a la página principal según tipo de usuario
        switch (tipoUsuario) {
          case 1:
            this.router.navigateByUrl('/principal/bienvenida');
            break;
          case 2:
            this.router.navigateByUrl('/principal/bienvenida2');
            break;
          case 3:
            this.router.navigateByUrl('/principal/bienvenida3');
            break;
          case 0:
            console.log('Profesional no aprobado');
            this.router.navigateByUrl('/profesional/pendiente-aprobacion');
            break;
          default:
            console.log('Tipo de usuario no reconocido');
            break;
        }

        } else {
          // Maneja el error de login aquí
          console.log('Credenciales incorrectas');
        }
      },
      error => {
        // Maneja el error de la solicitud aquí
        console.error('Error en la solicitud', error);
      }
     )*/

      public login() {
        console.log('Intentando loguear con:', this.usuario);
      
        this.usuarioservices.loginenApi(this.usuario).subscribe(
          (response: any) => {
            console.log('Respuesta de la API:', response);
      
            if (response && response.usuario != null) {
              // Usuario encontrado, continuar con el proceso de login
              this.usuarioservices.setLogueadoXapi(response);
      
              const tipoUsuario = Number(response.tipo);
              console.log('Tipo de usuario:', tipoUsuario);
      
              // Redirigir según el tipo de usuario
              switch (tipoUsuario) {
                case 1:
                  this.router.navigateByUrl('/principal/bienvenida');
                  break;
                case 2:
                  this.router.navigateByUrl('/principal/bienvenida2');
                  break;
                case 3:
                  this.router.navigateByUrl('/principal/bienvenida3');
                  break;
                default:
                  console.log('Tipo de usuario no reconocido');
                  break;
              }
            } else {
              // Manejar caso de credenciales incorrectas
              console.log('Credenciales incorrectas o usuario no encontrado');
              // Puedes mostrar un mensaje de error al usuario
            }
          },
          error => {
            console.error('Error en la solicitud', error);
            // Puedes mostrar un mensaje de error al usuario o manejarlo de otra manera
          }
        );
      }

  
  public prueba(){
    this.usuarioservices.mostrarApi().subscribe(
      t=> this.probando = (<any>t).mensaje
    )
  }   public probando:string="";



  public logout() {
    this.usuarioservices.logout();
    this.router.navigateByUrl('/principal/login');
  };

 

}
