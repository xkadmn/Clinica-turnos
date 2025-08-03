import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
  standalone: true,
  imports: [MenuComponent, RouterModule] // Importar MenuComponent aquí
})
export class PrincipalComponent { }
