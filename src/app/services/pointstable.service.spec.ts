import { TestBed } from '@angular/core/testing';

import { PointstableService } from './pointstable.service';

describe('PointstableService', () => {
  let service: PointstableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PointstableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
