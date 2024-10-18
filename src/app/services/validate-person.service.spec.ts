import { TestBed } from '@angular/core/testing';

import { ValidatePersonService } from '../validate-person.service';

describe('ValidatePersonService', () => {
  let service: ValidatePersonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidatePersonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
