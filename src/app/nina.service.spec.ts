import { TestBed } from '@angular/core/testing';

import { NinaService } from './nina.service';

describe('NinaService', () => {
  let service: NinaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NinaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
