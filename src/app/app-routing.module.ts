import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { PrincipalComponent } from './componentes/principal/principal.component';
import { ErrorComponent } from './componentes/error/error.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { BienvenidaComponent } from './componentes/bienvenida/bienvenida.component';
import { Bienvenida2Component } from './bienvenida2/bienvenida2.component';
import { Bienvenida3Component } from './bienvenida3/bienvenida3.component';

const routes: Routes = [
  { path: 'principal', component: PrincipalComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'login', component: LoginComponent },
      { path: 'registro', component: RegistroComponent },
      { path: 'bienvenida', component: BienvenidaComponent },
      { path: 'bienvenida2', component: Bienvenida2Component },
      { path: 'bienvenida3', component: Bienvenida3Component },
      
    ]
  },
  { path: '', redirectTo: 'principal', pathMatch: 'full' }, // Redirección desde la raíz a 'principal'
  { path: '**', component: ErrorComponent } // Manejo de rutas no reconocidas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
