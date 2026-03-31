/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UsuarioRolService } from './usuarioRol.service';

describe('Service: UsuarioRol', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsuarioRolService]
    });
  });

  it('should ...', inject([UsuarioRolService], (service: UsuarioRolService) => {
    expect(service).toBeTruthy();
  }));
});
