import { ApplicationModule, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorComponent } from './componentes/error/error.component';
import { RouterModule, provideRouter, Routes } from '@angular/router';
import { BienvenidaComponent } from './componentes/bienvenida/bienvenida.component';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { Bienvenida2Component } from './bienvenida2/bienvenida2.component';
import { Bienvenida3Component } from './bienvenida3/bienvenida3.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    BienvenidaComponent,
    Bienvenida2Component,
    Bienvenida3Component
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


