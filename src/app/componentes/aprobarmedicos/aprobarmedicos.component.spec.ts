import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobarmedicosComponent } from './aprobarmedicos.component';

describe('AprobarmedicosComponent', () => {
  let component: AprobarmedicosComponent;
  let fixture: ComponentFixture<AprobarmedicosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AprobarmedicosComponent]
    });
    fixture = TestBed.createComponent(AprobarmedicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
