/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PublicacionService } from './publicacion.service';

describe('Service: Publicacion', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PublicacionService]
    });
  });

  it('should ...', inject([PublicacionService], (service: PublicacionService) => {
    expect(service).toBeTruthy();
  }));
});
