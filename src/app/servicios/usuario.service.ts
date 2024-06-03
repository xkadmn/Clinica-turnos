import { Injectable } from '@angular/core';
import {  User } from '../entidades/usuario';
import { HttpClient, provideHttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiurl:string = "https://hkoo-clinicaapi.mdbgo.io";
  constructor(public http:HttpClient) { 
    this.listaUsuarios = JSON.parse(localStorage.getItem('usuario') || '[]');
    this.setLogueado()
   
  }
  public usuario:  User = {nombre:'', pass:'', mail: '', usuario: '' };

  public mostrarApi(){
    return this.http.get(this.apiurl + "/pruebajson");
  }

  public loginenApi(usuario:User){
    return this.http.post(this.apiurl + "/login",usuario);
  }
  
  public setLogueadoXapi(usuario:User){
    this.usuarioLogueado = usuario;
  }

  public usuarioLogueado:  User = {nombre:'', pass:'', mail: '', usuario: '' };
  public listaUsuarios: User[] = []; 
  

  public estoyLogueado() :boolean{
    return this.usuarioLogueado.nombre != '';
  }

  public setLogueado(){
    const usuarioLogueado = localStorage.getItem('usuarioLogueado');
    if (usuarioLogueado) {
      this.usuarioLogueado = JSON.parse(usuarioLogueado);
    } else {
      this.usuarioLogueado = { nombre: '', pass: '', mail: '', usuario: '' };
   // if(localStorage.getItem('usuarioLogueado') ?? '' != '')
    //  this.usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') ?? '');
  }
  }

  
  public logout() {
    localStorage.removeItem('usuarioLogueado');
    this.usuarioLogueado = { nombre: '', pass: '', mail: '' , usuario: '' };
  }
}
