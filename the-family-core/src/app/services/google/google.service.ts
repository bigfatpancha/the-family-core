import { Injectable } from '@angular/core';
import { GoogleApiService, GoogleAuthService } from 'ng-gapi';

@Injectable({
  providedIn: 'root'
})
export class GoogleService {

  constructor(
    private gapiService: GoogleApiService,
    private googleAuth: GoogleAuthService
  ) {
    this.googleAuth.getAuth().subscribe((auth) => {
      console.log(auth)
      auth.signIn();
    });
  }
}
