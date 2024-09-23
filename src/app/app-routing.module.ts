import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { PrincipalComponent } from './componentes/principal/principal.component';
import { ErrorComponent } from './componentes/error/error.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { BienvenidaComponent } from './componentes/bienvenida/bienvenida.component';
import { Bienvenida2Component } from './componentes/bienvenida2/bienvenida2.component';
import { Bienvenida3Component } from './componentes/bienvenida3/bienvenida3.component';
import { PedirTurnoComponent } from './componentes/turnos/turnos.component';
import { UsuarioService } from './servicios/usuario.service'; 
import  { PerfilComponent }  from './componentes/perfil/perfil.component';


const routes: Routes = [
  {
    path: 'principal',
    component: PrincipalComponent,
    children: [
      { path: '', redirectTo: 'bienvenida', pathMatch: 'full' }, // Redirigir a bienvenida por defecto
      { path: 'login', component: LoginComponent },
      { path: 'registro', component: RegistroComponent },
      { path: 'bienvenida', component: BienvenidaComponent },
      { path: 'bienvenida2', component: Bienvenida2Component },
      { path: 'bienvenida3', component: Bienvenida3Component },
      { path: 'pedirturno', component: PedirTurnoComponent },
      { path: 'perfil', component: PerfilComponent },

    ]
  },
  { path: '', redirectTo: 'principal', pathMatch: 'full' }, // Redirección desde la raíz a 'principal'
  { path: '**', component: ErrorComponent } // Manejo de rutas no reconocidas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private usuarioService: UsuarioService, private router: Router) {
    const usuarioLogueado = this.usuarioService.estoyLogueado();
    if (!usuarioLogueado) {
      this.router.navigate(['/principal/login']);
    } else {
      switch (this.usuarioService.getUsuarioLogueado()?.tipo) {
        case '1':
          this.router.navigate(['/principal/bienvenida']);
          break;
        case '2':
          this.router.navigate(['/principal/bienvenida2']);
          break;
        case '3':
          this.router.navigate(['/principal/bienvenida3']);
          break;
        default:
          this.router.navigate(['/principal']);
          break;
      }
    }
  }
}