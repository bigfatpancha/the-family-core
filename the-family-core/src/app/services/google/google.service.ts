import { Injectable } from '@angular/core';
import { GoogleApiService, GoogleAuthService } from 'ng-gapi';
import { HttpService } from '../http/http.service';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImportCalendarPost } from 'src/app/model/google';
import { Routes } from '../config/routes-enum';
import { GenericError } from 'src/app/model/error';
import { ErrorService } from '../error/error.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class GoogleService {

  headers: HttpHeaders = new HttpHeaders();

  constructor(
    private gapiService: GoogleApiService,
    private googleAuth: GoogleAuthService,
    private http_service: HttpService,
    private errorService: ErrorService,
    private spinner: NgxSpinnerService
  ) {
    this.headers = this.headers.set('accept', 'application/json')
                               .set('Content-Type', 'application/json');
  }

  getToken() {
    this.gapiService.onLoad().subscribe(() => {
      this.googleAuth.getAuth().subscribe((auth) => {
        auth.signIn().then(res => {
          this.spinner.show();
          const body = new ImportCalendarPost(res.Zi.access_token);
          this.doImportCalendarPost(body).subscribe((res) => {
            this.spinner.hide();
            alert(res.detail);
          }, (err: GenericError) => {
            this.spinner.hide();
            this.errorService.showError(err);
          })
        });
      });
    })
  }

  doImportCalendarPost(body: ImportCalendarPost): Observable<any> {
    const headers = this.headers.set('Authorization', 'Token ' + this.http_service.key );
    const options = {
      headers: headers
    };
    return this.http_service.doPost(Routes.IMPORT_CALENDAR, body, options);
  }
}
