import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bienvenida3Component } from './bienvenida3.component';

describe('Bienvenida3Component', () => {
  let component: Bienvenida3Component;
  let fixture: ComponentFixture<Bienvenida3Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Bienvenida3Component]
    });
    fixture = TestBed.createComponent(Bienvenida3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
