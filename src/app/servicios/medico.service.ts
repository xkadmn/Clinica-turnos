import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  private apiUrl = 'https://hkoo-clinicaapi.mdbgo.io'; // Ajusta la URL base de tu API

  constructor(private http: HttpClient) {}

  // Obtener especialidades
  getEspecialidades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/especialidades`).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener médicos por especialidad
  getMedicosByEspecialidad(especialidadId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/medicos-por-especialidad/${especialidadId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener detalles de un médico por su ID
  getMedicoById(medicoId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/medicos/${medicoId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener todos los médicos
  getTodosLosMedicos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/medicos`).pipe(
      catchError(this.handleError)
    );
  }


  habilitarTurnos(turno: any): Observable<any> {
    const turnos = [];
    let horaActual = new Date(`${turno.fecha}T${turno.horaInicio}`);
    const horaFin = new Date(`${turno.fecha}T${turno.horaFin}`);
  
    while (horaActual < horaFin) {
      turnos.push({
        fecha: turno.fecha,
        hora: horaActual.toTimeString().substring(0, 5),
        especialidadId: turno.especialidadId,
        disponible: true,
        usuarioMedicoId: 1 // Reemplaza con el ID del médico logueado
      });
  
      horaActual.setMinutes(horaActual.getMinutes() + 20);
    }
  
    return this.http.post(`${this.apiUrl}/api/turnos`, { turnos }).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores
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
  }
}