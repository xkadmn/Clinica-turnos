import { Injectable } from '@angular/core';
import { User, Perfil } from '../entidades/usuario';
import { HttpClient } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  // private apiurl: string = "https://hkoo-clinicaapi.mdbgo.io";
  private apiurl: string = "https://clinicaapi-g1o2.onrender.com";
  public usuarioLogueado: User = {
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
        fecnac: '',
        aprobado: false,
      };
    }
  }
  public obtenerUltimoId(): Observable<number> {
    return this.http.get<number>(`${this.apiurl}/ultimo-id`);
  }
  registrarUsuario(usuario: User): Observable<any> {
    return this.http.post(`${this.apiurl}/insertar`, usuario);
  }
  registrarPerfil(usuarioId: number, perfil: any): Observable<any> {
    return this.http.post(`${this.apiurl}/perfil/${usuarioId}`, perfil);
  }
  registrarFichaMedica(usuarioId: number, fichaMedica: any): Observable<any> {
    return this.http.post(`${this.apiurl}/ficha-medica/${usuarioId}`, fichaMedica);
  }

  registrarEspecialidades(usuarioId: number, especialidades: string[]): Observable<any> {
    return this.http.post(`${this.apiurl}/especialidades/${usuarioId}`, { especialidades });
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
      fecnac: '',
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

  public actualizarPerfil(perfil: Perfil): Observable<Perfil> {
    return this.http.put<Perfil>(`${this.apiurl}/perfil/${perfil.id}`, perfil);
  }
cambiarContrasena(userId: number, nuevaContrasena: string) {
  return this.http.put(`/api/usuarios/${userId}/cambiarContrasena`, { nuevaContrasena });
}
}