import { Injectable } from '@angular/core';
import {  User } from '../entidades/usuario';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiurl:string = "https://hkoo-clinicaapi.mdbgo.io";
  constructor(public http:HttpClient) { 
    this.listaUsuarios = JSON.parse(localStorage.getItem('usuario') || '[]');
    this.setLogueado()
   
  }
  public usuario:  User = {
    nombre: '',
    apellido: '',
    usuario: '',
    pass: '',
    mail: '',   // Asegúrate de que mail está aquí
    tipo: '',
    fecNac: new Date(),
  };

  public mostrarApi(){
    return this.http.get(this.apiurl + "/pruebajson");
  }

  public loginenApi(usuario:User){
    return this.http.post(this.apiurl + "/login",usuario);
  }
  
  public setLogueadoXapi(usuario:User){
    this.usuarioLogueado = usuario;
    localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
  }

  public usuarioLogueado:  User = {
    nombre: '',
    apellido: '',
    usuario: '',
    pass: '',
    mail: '',   // Asegúrate de que mail está aquí
    tipo: '',
    fecNac: new Date(),
  };
  public listaUsuarios: User[] = []; 
  

  public estoyLogueado() :boolean{
    return this.usuarioLogueado.usuario != '';
  }

  public setLogueado(){
    const usuarioLogueado = localStorage.getItem('usuarioLogueado');
    if (usuarioLogueado) {
      this.usuarioLogueado = JSON.parse(usuarioLogueado);
    } else {
      this.usuarioLogueado = { nombre: '',apellido :'', usuario: '', pass: '', mail: '' ,tipo: '',fecNac: new Date(),};
   // if(localStorage.getItem('usuarioLogueado') ?? '' != '')
    //  this.usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado') ?? '');
  }
  }

    // Método para registrar usuario
  
    registrar(usuario: User): Observable<any> {
      return this.http.post<any>(`${this.apiurl}/insertar`, usuario);
    }

  
  public logout() {
    localStorage.removeItem('usuarioLogueado');
    this.usuarioLogueado = { nombre: '',apellido :'', usuario: '', pass: '', mail: '' ,tipo: '',fecNac: new Date(),};
  }

  public getUsuarioLogueado(): User | null {
    return this.usuarioLogueado;
  }
}
