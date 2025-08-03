import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // Importa FormsModule

import { PedirTurnoComponent } from './turnos.component'; // Asegúrate de importar el componente correcto

describe('PedirTurnoComponent', () => { // Cambia 'TurnosComponent' a 'PedirTurnoComponent'
  let component: PedirTurnoComponent; // Cambia 'TurnosComponent' a 'PedirTurnoComponent'
  let fixture: ComponentFixture<PedirTurnoComponent>; // Cambia 'TurnosComponent' a 'PedirTurnoComponent'

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PedirTurnoComponent], // Cambia 'TurnosComponent' a 'PedirTurnoComponent'
      imports: [FormsModule] // Asegúrate de importar FormsModule aquí
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PedirTurnoComponent); // Cambia 'TurnosComponent' a 'PedirTurnoComponent'
    component = fixture.componentInstance; // Cambia 'TurnosComponent' a 'PedirTurnoComponent'
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
