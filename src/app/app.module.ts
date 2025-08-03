import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ErrorComponent } from './componentes/error/error.component';
import { RouterModule} from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { Bienvenida3Component } from './componentes/bienvenida3/bienvenida3.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AprobarmedicosComponent } from './componentes/aprobarmedicos/aprobarmedicos.component';
import { AprobadoPipe } from './pipes/aprobado.pipe';
import { AgendaMedicoComponent } from './componentes/agenda-medico/agenda-medico.component';
import { TurnosPacienteComponent } from './componentes/turnos-paciente/turnos-paciente.component';
import { JwtModule, JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { EstadisticasAdminComponent } from './componentes/estadisticas-admin/estadisticas-admin.component';


export function jwtOptionsFactory() {
  return {
    tokenGetter: () => localStorage.getItem('token'),
    allowedDomains: ['clinicaapi-g1o2.onrender.com'],
    disallowedRoutes: ['clinicaapi-g1o2.onrender.com/login']
  };
}

@NgModule({
  declarations: [
    AppComponent,
    Bienvenida3Component,
    AprobarmedicosComponent,
    AprobadoPipe,
    AgendaMedicoComponent,
    TurnosPacienteComponent,
    EstadisticasAdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ErrorComponent,
    HttpClientModule,
    FormsModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory
      }
    })
  ],
  providers: [JwtHelperService, {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }