import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bienvenida2Component } from './bienvenida2.component';

describe('Bienvenida2Component', () => {
  let component: Bienvenida2Component;
  let fixture: ComponentFixture<Bienvenida2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Bienvenida2Component]
    });
    fixture = TestBed.createComponent(Bienvenida2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
