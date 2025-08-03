
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Especialidad } from 'src/app/entidades/medico';
@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {
  private apiUrl = 'https://clinicaapi-g1o2.onrender.com';
  private especialidadesSubject = new BehaviorSubject<Especialidad[]>([]);
  especialidades$ = this.especialidadesSubject.asObservable();
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
  
  getEspecialidadPorId(id: number): Observable<Especialidad | undefined> {
    return this.especialidades$.pipe(
      map(especialidades => especialidades.find(e => e.id === id))
    );
  }
}