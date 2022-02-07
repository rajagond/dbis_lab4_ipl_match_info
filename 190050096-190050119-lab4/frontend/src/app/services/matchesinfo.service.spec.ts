import { TestBed } from '@angular/core/testing';

import { MatchesinfoService } from './matchesinfo.service';

describe('MatchesinfoService', () => {
  let service: MatchesinfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchesinfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
