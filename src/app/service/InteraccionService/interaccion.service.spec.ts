/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { InteraccionService } from './interaccion.service';

describe('Service: Interaccion', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InteraccionService]
    });
  });

  it('should ...', inject([InteraccionService], (service: InteraccionService) => {
    expect(service).toBeTruthy();
  }));
});
