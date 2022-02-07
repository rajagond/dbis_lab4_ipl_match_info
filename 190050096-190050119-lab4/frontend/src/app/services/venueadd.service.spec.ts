import { TestBed } from '@angular/core/testing';

import { VenueaddService } from './venueadd.service';

describe('VenueaddService', () => {
  let service: VenueaddService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VenueaddService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
