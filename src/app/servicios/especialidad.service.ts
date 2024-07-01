import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medico,  Especialidad } from 'src/app/entidades/medico';
import { tap } from 'rxjs/operators'; // Importar tap desde RxJS

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {
  private apiUrl = 'https://hkoo-clinicaapi.mdbgo.io';

  constructor(private http: HttpClient) {}

  getEspecialidades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/especialidades`);
  }

  getMedicosPorEspecialidad(especialidadId: number): Observable<any[]> {
    const url = `${this.apiUrl}/medicos-por-especialidad/${especialidadId}`;
    return this.http.get<any[]>(url);
  }

  obtenerEspecialidadesMedico(medicoId: number): Observable<Especialidad[]> {
    const url = `${this.apiUrl}/medico/${medicoId}/especialidades`;
    return this.http.get<Especialidad[]>(url);
  }
}