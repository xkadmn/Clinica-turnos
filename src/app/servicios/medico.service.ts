import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Medico, Turno } from 'src/app/entidades/medico';
@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  private apiUrl = 'https://hkoo-clinicaapi.mdbgo.io'; // Ajusta la URL base de tu API

  constructor(private http: HttpClient) {}

  // Obtener especialidades
  getEspecialidades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/especialidades`).pipe(
     // catchError(this.handleError)
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
    // Realizar la solicitud HTTP POST para crear múltiples turnos
    return this.http.post(`${this.apiUrl}/api/turnos`, turnos);
  }
 /* // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      console.error('Error del lado del cliente:', error.error.message);
    } else {
      // El servidor devolvió un código de error
      console.error(`Código de error ${error.status}, ` + `Mensaje: ${error.message}`);
    }
    // Retorna un observable con un mensaje de error
    return throwError('Hubo un problema al cargar los datos. Por favor, intenta nuevamente más tarde.');
  }*/
}