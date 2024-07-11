import { TestBed } from '@angular/core/testing';

import { TraceIduService } from './trace-idu.service';

describe('TraceIduService', () => {
  let service: TraceIduService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TraceIduService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
