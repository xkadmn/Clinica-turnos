import { Injectable } from '@angular/core';
import { User, Perfil } from '../entidades/usuario';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

/** Estructura de la respuesta de login con JWT
 */
interface LoginResponse {
  token:    string;
  id:       number;
  usuario:  string;
  nombre:   string;
  apellido: string;
  tipo:     string;   // '1' | '2' | '3'
}

/**Interfaz sólo con las credenciales que pide el endpoint /login 
 */
interface LoginCredentials {
  usuario: string;
  pass:     string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  // URL base de la API
  private apiurl: string = 'https://clinicaapi-g1o2.onrender.com';
  // Clave para almacenar el token en localStorage
  private readonly tokenKey = 'token';

/** token en memoria para no leer storage todo el tiempo */
  private currentToken: string | null = null;

  public usuarioLogueado: User = {
    id: 0, nombre: '', apellido: '', usuario: '',
    pass: '', mail: '', tipo: '', fecnac: '', aprobado: false,
  };


 
  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {
    /* Al iniciar, intenta decodificar un token válido */
    const token = this.obtenerToken();
    if (token && this.esJwtValido(token) && !this.jwtHelper.isTokenExpired(token)) {
      this.currentToken = token;
      try {
        const payload: any = this.jwtHelper.decodeToken(token); 
        this.usuarioLogueado.id = payload.id; 
        this.usuarioLogueado.tipo = payload.rol; 
        this.usuarioLogueado.nombre = payload.nombre ?? '';
        this.usuarioLogueado.apellido = payload.apellido ?? '';        
      } catch (e) {
        console.warn('Error decodificando JWT en constructor:', e);
      }
    }
  }

 
  /**
   * Envía credenciales al endpoint /login y espera recibir un JWT
   */

  loginJwt(creds: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiurl}/login`, creds);
  }

  /**
   * Guarda el JWT en localStorage
   */
  guardarToken(token: string, persistir: boolean = true): void {
    if (persistir) {
      localStorage.setItem(this.tokenKey, token);
    } else {
      sessionStorage.setItem(this.tokenKey, token);
    }
    this.currentToken = token;

    // --- Nuevo bloque para actualizar usuarioLogueado ---
    const payload: any = this.jwtHelper.decodeToken(token);
    this.usuarioLogueado.id       = payload.id;
    this.usuarioLogueado.tipo     = payload.rol;
    this.usuarioLogueado.nombre   = payload.nombre   ?? '';
    this.usuarioLogueado.apellido = payload.apellido ?? '';
    this.usuarioLogueado.aprobado = payload.aprobado === 1 || payload.aprobado === true;
    // -------------------------------------------------------
  }

  obtenerToken(): string | null {
    return this.currentToken ??
           localStorage.getItem(this.tokenKey) ??
           sessionStorage.getItem(this.tokenKey);
  }

  isTokenExpired(token?: string): boolean {
    const t = token ?? this.obtenerToken();
    if (!t || !this.esJwtValido(t)) return true;
    try { return this.jwtHelper.isTokenExpired(t); } catch { return true; }
  }
  /**
   * Decodifica y retorna el payload del JWT 
   */
  public getTokenPayload(): any {
    const token = this.obtenerToken();
    if (!token || !this.esJwtValido(token) || this.isTokenExpired(token)) {
      return null;
    }
    try {
      return this.jwtHelper.decodeToken(token);
    } catch {
      return null;
    }
  }
  
  getUsuarioLogueado(): User {
    return this.usuarioLogueado;
  }

  actualizarUsuario(p: Partial<User>): void {
    this.usuarioLogueado = { ...this.usuarioLogueado, ...p };
  }

    /* ------------------  UTILIDADES PRIVADAS  ----------------- */

  private esJwtValido(token: string): boolean {
    return token.split('.').length === 3;
  }



  /**
   * Extrae el rol del usuario desde el payload
   */
  public getUserRole(): string | null {
    const payload = this.getTokenPayload();
    return payload && payload.rol ? payload.rol : null;
  }

  /**
   * Elimina el token y resetea el usuario logueado
   */
 logout(): void {
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
    this.currentToken = null;
    this.usuarioLogueado = {
      id: 0, nombre: '', apellido: '', usuario: '',
      pass: '', mail: '', tipo: '', fecnac: '', aprobado: false,
    };
  }


  /**
   * Comprueba si hay un token válido (usuario autenticado)
   */
  public estoyLogueado(): boolean {
    // Si no hay token o está expirado, devuelve false
  return !this.isTokenExpired(this.obtenerToken() ?? undefined);
  }

  // Métodos originales de acceso a API (usuarios, perfiles, turnos, etc.)
  public mostrarApi(): Observable<any> {
    return this.http.get<any>(`${this.apiurl}/pruebajson`);
  }

  public obtenerUltimoId(): Observable<number> {
    return this.http.get<number>(`${this.apiurl}/ultimo-id`);
  }

  public registrarUsuario(usuario: User): Observable<any> {
    return this.http.post<any>(`${this.apiurl}/insertar`, usuario);
  }

  public registrarPerfil(usuarioId: number, perfil: Perfil | FormData): Observable<any> {
  return this.http.post<any>(`${this.apiurl}/insertarperfil/${usuarioId}`, perfil);
 }

  public registrarFichaMedica(usuarioId: number, fichaMedica: any): Observable<any> {
    return this.http.post<any>(`${this.apiurl}/ficha-medica/${usuarioId}`, fichaMedica);
  }

  public registrarEspecialidades(usuarioId: number, especialidades: string[]): Observable<any> {
    return this.http.post<any>(
      `${this.apiurl}/insertar-especialidades`,
      { medicoId: usuarioId, especialidades }
    );
  }

  public getMedicosNoAprobados(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiurl}/medicos-pendientes`);
  }

  public getTodosLosMedicos(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiurl}/todos-los-medicos`);
  }

  public aprobarMedico(usuarioId: number): Observable<any> {
    return this.http.put<any>(`${this.apiurl}/aprobar-medico/${usuarioId}`, {});
  }

  public toggleAprobacionMedico(usuarioId: number, nuevoEstado: boolean): Observable<any> {
    return this.http.put<any>(
      `${this.apiurl}/aprobar-medico/${usuarioId}`,
      { aprobado: nuevoEstado }
    );
  }

  public getPerfilUsuario(usuarioId: number): Observable<Perfil> {
    return this.http.get<Perfil>(`${this.apiurl}/perfil/${usuarioId}`);
  }
  

actualizarPerfil(perfil: Perfil): Observable<any> {
  return this.http.put<any>(
    `${this.apiurl}/perfil/${perfil.id}`,           // MISMA ruta
    { perfil: JSON.stringify(perfil) }              // formateo que espera el servidor
  );
}

// Nueva actualización con foto (FormData)
actualizarPerfilConFoto(fd: FormData): Observable<any> {
  return this.http.put(`${this.apiurl}/perfil/${this.usuarioLogueado.id}`, fd);
}

public getTodosUsuarios(): Observable<User[]> {
  return this.http.get<User[]>(`${this.apiurl}/usuarios`);
}

  

  public cambiarContrasena(userId: number, nuevaContrasena: string): Observable<any> {
    return this.http.put<any>(
      `${this.apiurl}/usuarios/${userId}/cambiarContrasena`,
      { nuevaContrasena }
    );
  }

  public getMedicosAprobados(): Observable<User[]> {
  return this.http.get<User[]>(`${this.apiurl}/medicos-aprobados`);
  } 
  
}
