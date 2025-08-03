import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Medico, Turno } from 'src/app/entidades/medico';
@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  private apiUrl = 'https://clinicaapi-g1o2.onrender.com';

  constructor(private http: HttpClient) {}

  // Obtener especialidades
  getEspecialidades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/especialidades`).pipe(
    
    );
  }

  // Obtener médicos por especialidad
  getMedicosByEspecialidad(especialidadId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/medicos-por-especialidad/${especialidadId}`).pipe(
     // catchError(this.handleError)
    );
  }

  // Obtener detalles de un médico por su ID
  getMedicoById(medicoId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/medicos/${medicoId}`).pipe(
     // catchError(this.handleError)
    );
  }

  // Obtener todos los médicos
  getTodosLosMedicos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/medicos`).pipe(
     // catchError(this.handleError)
    );
  }

  
  habilitarTurno(turnos: Turno[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/turnos`, turnos).pipe(
      catchError(this.handleError)
    );
  }

  eliminarTurno(turnoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminarturno/${turnoId}`).pipe(
      catchError(this.handleError)
    );
  }

  cancelarTurno(turnoId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/cancelarturno/${turnoId}`, {}).pipe(
        catchError(this.handleError)
    );
}
  
  private handleError(error: HttpErrorResponse) {
    // Manejo de errores
    return throwError('Error en la solicitud, por favor intente nuevamente.');
  }

}