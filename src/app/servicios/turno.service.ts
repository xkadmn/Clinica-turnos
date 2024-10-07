import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turno } from 'src/app/entidades/medico'; // Asegúrate de que esta ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private apiUrl = 'https://hkoo-clinicaapi.mdbgo.io'; // Cambia esto según tu API

  constructor(private http: HttpClient) {}

  getTurnosPorMedico(medicoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/turnos?usuarioMedicoId=${medicoId}`); // Ajusta según tu API
  }
  
  getTurnosMedicoporsemana(medicoId: number, especialidadId: number, fechaInicio: string, fechaFin: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/turnos/${medicoId}?especialidadId=${especialidadId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
}

}
