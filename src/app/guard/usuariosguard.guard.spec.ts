import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { usuariosguardGuard } from './usuariosguard.guard';

describe('usuariosguardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => usuariosguardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
