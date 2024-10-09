import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turno } from 'src/app/entidades/medico'; // Asegúrate de que esta ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private apiUrl = 'https://hkoo-clinicaapi.mdbgo.io'; // Cambia esto según tu API

  constructor(private http: HttpClient, ) {}

  getTurnosPorMedico(medicoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/turnos?usuarioMedicoId=${medicoId}`); // Ajusta según tu API
  }
  
  getTurnosMedicoPorsemana(medicoId: number, especialidadId: number, fechaInicio: string, fechaFin: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/turnos/${medicoId}?especialidadId=${especialidadId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
}
getTurnosPorDia(medicoId: number, especialidadId: number, fecha: string): Observable<Turno[]> {
  return this.http.get<Turno[]>(`${this.apiUrl}/turnos/${medicoId}/${especialidadId}/${fecha}`);
}
obtenerTurnosPorDia(medicoId: number, especialidadId: number, fecha: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/turnos/${medicoId}/${especialidadId}/${fecha}`);
}
aceptarTurno(turno: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/turnos/${turno.id}`, turno); // Cambia esta URL según tu API
}


}
