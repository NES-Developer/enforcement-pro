import { TestBed } from '@angular/core/testing';
import { ValidatePersonService } from './validate-person.service';
import { AppHttpService } from './enforcementpro/app-http.service';

describe('ValidatePersonService', () => {
  let service: ValidatePersonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ValidatePersonService,
        { provide: AppHttpService, useValue: { post: () => undefined } }
      ]
    });
    service = TestBed.inject(ValidatePersonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
