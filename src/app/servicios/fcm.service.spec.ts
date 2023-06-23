import { TestBed } from '@angular/core/testing';

import { FirebaseCloudMessagingService } from './fcm.service';

describe('FmcService', () => {
  let service: FirebaseCloudMessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseCloudMessagingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
