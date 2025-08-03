import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioService } from './usuario.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/entidades/usuario';

export interface Estadisticas {
  avgRating: number;
  totalRatings: number;
  evaluations: Array<{
    puntuacion: number;
    comentario: string;
    fecha: string;
    especialidad: string;
  }>;
}

@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  private apiUrl = 'https://clinicaapi-g1o2.onrender.com/api';
  constructor(private http: HttpClient, private userSvc: UsuarioService) {}

getEstadisticas(medicoId: number): Observable<Estadisticas> {
  const token = this.userSvc.obtenerToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  // Quito el "/api" adicional aquí:
  return this.http.get<Estadisticas>(
    `${this.apiUrl}/estadisticas/medico/${medicoId}`,
    { headers }
  );
}
}
