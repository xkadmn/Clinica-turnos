import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Turno} from 'src/app/entidades/medico';
import { catchError, tap } from 'rxjs/operators';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
   private apiUrl = 'https://clinicaapi-g1o2.onrender.com/api';

  constructor(private http: HttpClient, private userSvc: UsuarioService) {}
  
  getTurnosPorMedico(
  medicoId: number,
  startDate?: string,
  endDate?: string
): Observable<Turno[]> {
  // construye la URL base
  let url = `${this.apiUrl}/verturnos`;
  // si me pasan fechas, añádelas como query params
  if (startDate && endDate) {
    url += `?startDate=${startDate}&endDate=${endDate}`;
  }
  return this.http.get<Turno[]>(url);
}
  
  getTurnosMedicoPorsemana(
    medicoId: number,
    especialidadId: number,
    fechaInicio: string,
    fechaFin: string
  ): Observable<Turno[]> {
    const url = `${this.apiUrl}/verturnos`
      + `?startDate=${fechaInicio}`
      + `&endDate=${fechaFin}`
      + `&especialidadId=${especialidadId}`;
    return this.http.get<Turno[]>(url).pipe(
      catchError(err => {
        console.error('Error al obtener turnos semanales:', err);
        return throwError(err);
      })
    );
  }

 getTurnosPorDia(
    medicoId: number,
    especialidadId: number,
    fecha: string
  ): Observable<Turno[]> {
    return this.http.get<Turno[]>(
      `${this.apiUrl}/verturnos?startDate=${fecha}&endDate=${fecha}`
    ).pipe(
      catchError(err => {
        console.error('Error al obtener turnos por día:', err);
        return throwError(err);
      })
    );
  }

obtenerTurnosPorDia = this.getTurnosPorDia;

aceptarTurno(turno: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/turnos/${turno.id}`, turno)
      .pipe(
        catchError(err => {
          console.error('Error al aceptar el turno:', err);
          return throwError(err);
        })
      );
}

getTurnosPorPaciente(pacienteId: number): Observable<Turno[]> {
    return this.http.get<Turno[]>(`${this.apiUrl}/turnos/pacienteId/${pacienteId}`)
      .pipe(
        catchError(err => {
          console.error('Error al obtener turnos por paciente:', err);
          return throwError(err);
        })
      );
}


getTurnosPublicosMedico(
  medicoId: number,
  especialidadId: number,
  fechaInicio: string,
  fechaFin: string
): Observable<Turno[]> {
  const url = `${this.apiUrl}/verturnos-medico`
    + `?medicoId=${medicoId}`
    + `&especialidadId=${especialidadId}`
    + `&startDate=${fechaInicio}`
    + `&endDate=${fechaFin}`;
  return this.http.get<Turno[]>(url);
}

getMisTurnos(): Observable<Turno[]> {
    return this.http.get<Turno[]>(`${this.apiUrl}/turnos/mis-turnos`);
}

cancelarTurnoPaciente(turnoId: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/cancelarturno-paciente/${turnoId}`, {});
}

puntuarTurno(id: number, body: { puntuacion: number; comentario?: string }) {
    const token = this.userSvc.obtenerToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(
      `${this.apiUrl}/turnos/${id}/puntuacion`,
      body,
      { headers }
    );
  }

}
