import { ApplicationModule, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ErrorComponent } from './componentes/error/error.component';
import { RouterModule, provideRouter, Routes } from '@angular/router';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { Bienvenida3Component } from './componentes/bienvenida3/bienvenida3.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AprobarmedicosComponent } from './componentes/aprobarmedicos/aprobarmedicos.component';
import { AprobadoPipe } from './pipes/aprobado.pipe';
import { AgendaMedicoComponent } from './componentes/agenda-medico/agenda-medico.component';


@NgModule({
  declarations: [
    AppComponent,

    Bienvenida3Component,
    AprobarmedicosComponent,
    AprobadoPipe,
    AgendaMedicoComponent,
 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ErrorComponent,
    HttpClientModule,
    FormsModule
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }