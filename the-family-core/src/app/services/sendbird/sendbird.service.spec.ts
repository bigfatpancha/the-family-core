import { TestBed } from '@angular/core/testing';

import { SendbirdService } from './sendbird.service';

describe('SendbirdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SendbirdService = TestBed.get(SendbirdService);
    expect(service).toBeTruthy();
  });
});
