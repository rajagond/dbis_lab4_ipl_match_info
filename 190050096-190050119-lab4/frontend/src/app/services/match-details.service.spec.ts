import { TestBed } from '@angular/core/testing';

import { MatchDetailsService } from './match-details.service';

describe('MatchDetailsService', () => {
  let service: MatchDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
