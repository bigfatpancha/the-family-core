import { TestBed } from '@angular/core/testing';

import { EventRecurrenceService } from './event-recurrence.service';

describe('EventRecurrenceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventRecurrenceService = TestBed.get(EventRecurrenceService);
    expect(service).toBeTruthy();
  });
});
