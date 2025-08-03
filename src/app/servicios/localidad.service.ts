import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Localidad {
  id: number;
  nombre: string;
  provincia: string;
}

@Injectable({ providedIn: 'root' })
export class LocalidadService {
  private apiUrl = 'https://clinicaapi-g1o2.onrender.com';

  constructor(private http: HttpClient) {}

  getLocalidades(): Observable<Localidad[]> {
    return this.http.get<Localidad[]>(`${this.apiUrl}/localidades`);
  }
}