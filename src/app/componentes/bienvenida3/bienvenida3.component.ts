import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from 'src/app/servicios/usuario.service';
@Component({
  selector: 'app-bienvenida3',
  templateUrl: './bienvenida3.component.html',
  styleUrls: ['./bienvenida3.component.css']
  
})
export class Bienvenida3Component {
  constructor(public usuarioService: UsuarioService) {}
}
