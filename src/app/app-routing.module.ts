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
import  { PerfilComponent }  from './componentes/perfil/perfil.component';
import { AgendaMedicoComponent } from './componentes/agenda-medico/agenda-medico.component';
import { TurnosPacienteComponent } from './componentes/turnos-paciente/turnos-paciente.component';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  {
    path: 'principal',
    component: PrincipalComponent,
    children: [
      // — rutas públicas, sin guard —
      { path: 'login',    component: LoginComponent },
      { path: 'registro', component: RegistroComponent },

      // — rutas protegidas bajo AuthGuard —
      {
        path: '',
        canActivate:     [AuthGuard],
        canActivateChild:[AuthGuard],
        children: [
          // la ruta '' aquí disparará el redirect interno en el guard
          { path: '', pathMatch: 'full', component: LoginComponent },

          // tus componentes “internos”
          { path: 'bienvenida',        component: BienvenidaComponent  },
          { path: 'bienvenida2',       component: Bienvenida2Component },
          { path: 'bienvenida3',       component: Bienvenida3Component },
          { path: 'pedirturno',        component: PedirTurnoComponent  },
          { path: 'perfil',            component: PerfilComponent      },
          { path: 'agenda-medico/:medicoId', component: AgendaMedicoComponent },
          { path: 'turnos-paciente',           component: TurnosPacienteComponent }
        ]
      }
    ]
  },
  { path: '', redirectTo: 'principal', pathMatch: 'full' },
  { path: '**', redirectTo: 'principal' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}