import { Injectable } from '@angular/core';
import { User, Perfil } from '../entidades/usuario';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiurl: string = "https://hkoo-clinicaapi.mdbgo.io";
  public usuarioLogueado: User = {
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

  public listaUsuarios: User[] = []; 
  

  constructor(private http: HttpClient) {
    this.setLogueado();
  }

  public mostrarApi(): Observable<any> {
    return this.http.get(this.apiurl + "/pruebajson");
  }

  public loginenApi(usuario: User): Observable<any> {
    return this.http.post(this.apiurl + "/login", usuario);
  }

  public setLogueadoXapi(usuario: User) {
    this.usuarioLogueado = usuario;
    localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
  }

  public setLogueado() {
    const usuarioLogueado = localStorage.getItem('usuarioLogueado');
    if (usuarioLogueado) {
      this.usuarioLogueado = JSON.parse(usuarioLogueado);
    } else {
      this.usuarioLogueado = {
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
    }
  }

  public registrar(usuario: User): Observable<any> {
    usuario.aprobado = (usuario.tipo === '2') ? false : true;
    return this.http.post<any>(`${this.apiurl}/insertar`, usuario);
  }

  public logout() {
    localStorage.removeItem('usuarioLogueado');
    this.usuarioLogueado = {
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
  }

  public estoyLogueado(): boolean {
    return this.usuarioLogueado.usuario !== '';
  }

  public getUsuarioLogueado(): User | null {
    return this.usuarioLogueado;
  }


//medico no aprobado y aprobar medico para usuario tipo 3
    getMedicosNoAprobados(): Observable<User[]> {
      return this.http.get<User[]>(`${this.apiurl}/medicos-pendientes`);
    }
    
    getTodosLosMedicos(): Observable<User[]> {
      return this.http.get<User[]>(`${this.apiurl}/todos-los-medicos`);
    }
  
   aprobarMedico(usuarioId: number): Observable<any> {
      return this.http.put<any>(`${this.apiurl}/aprobar-medico/${usuarioId}`, {});
    }


    toggleAprobacionMedico(usuarioId: number, nuevoEstado: boolean): Observable<any> {
      return this.http.put<any>(`${this.apiurl}/aprobar-medico/${usuarioId}`, { aprobado: nuevoEstado });
    }

    public getPerfilUsuario(usuarioId: number): Observable<Perfil> {
      return this.http.get<Perfil>(`${this.apiurl}/perfil/${usuarioId}`);
  }
}