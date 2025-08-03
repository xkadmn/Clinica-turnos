import { Component, OnInit } from '@angular/core';
import { EstadisticasService, Estadisticas } from 'src/app/servicios/estadisticas.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { User , Perfil } from 'src/app/entidades/usuario';
import { tap,  map } from 'rxjs/operators';


@Component({
  selector: 'app-estadisticas-admin',
  templateUrl: './estadisticas-admin.component.html',
  styleUrls:   ['./estadisticas-admin.component.css']
})
// estadisticas-admin.component.ts
export class EstadisticasAdminComponent implements OnInit {
  medicos: User[] = [];
  selectedMedico: User | null = null;
  perfilUsuario: Perfil | null = null;
  stats: Estadisticas | null = null;
  stars: ('full' | 'half' | 'empty')[] = [];

  constructor(public userSvc: UsuarioService, public statsSvc: EstadisticasService) {}
  ngOnInit() {
    this.userSvc.getTodosLosMedicos()
      .subscribe((list: User[]) => {
        this.medicos = list.filter(m => m.aprobado);
      });
  }

  onMedicoChange(medico: User | null) {
    if (!medico) return;
    this.selectedMedico = medico;

    // 1) Perfil
    this.userSvc.getPerfilUsuario(medico.id)
      .subscribe(p => {
        if ((p as any).foto_perfil?.data) {
          p.foto_perfil = this.bufferToBase64((p as any).foto_perfil);
        }
        this.perfilUsuario = p;
      });

    // 2) Estadísticas
     this.statsSvc.getEstadisticas(medico.id)
      .subscribe(data => {
        this.stats = data;
        const avg = parseFloat(data.avgRating as any);

        // Genera un array de 5 estrellas
        this.stars = Array.from({ length: 5 }, (_, i) => {
          if (avg >= i+1) return 'full';
          if (avg >= i + 0.5) return 'half';
          return 'empty';
        });
      });
  }

  private bufferToBase64(buf: { data: number[] }): string {
    const bytes = new Uint8Array(buf.data);
    let binary = '';
    bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary);
  }
    
  getStarsForRating(rating: number): ('full'|'half'|'empty')[] {
    const r = +rating;
    return Array.from({ length: 5 }, (_, i) => {
      if (r >= i + 1)   return 'full';
      if (r >= i + 0.5) return 'half';
      return 'empty';
    });
  }

  

}