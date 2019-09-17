import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';
import { Subscription, SubscriptionRequest } from 'src/app/model/subscription';
import { Routes } from '../config/routes-enum';

export const PLAN = 'plan_FMtk4OUbYtSsbX';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  headers: HttpHeaders = new HttpHeaders();

  constructor(private http_service: HttpService) {
    this.headers = this.headers
      .set('accept', 'application/json')
      .set('content-type', 'application/json');
  }

  doSubscriptionGet(): Observable<Subscription> {
    const headers = this.headers.set(
      'Authorization',
      'Token ' + this.http_service.key
    );
    const options = {
      headers: headers
    };
    return this.http_service.doGet(Routes.SUBSCRIPTION, options);
  }

  doSubscriptionPost(
    body: SubscriptionRequest
  ): Observable<SubscriptionRequest> {
    const headers = this.headers.set(
      'Authorization',
      'Token ' + this.http_service.key
    );
    const options = {
      headers: headers
    };
    console.log(Routes.SUBSCRIPTION, body);
    return this.http_service.doPost(Routes.SUBSCRIPTION, body, options);
  }

  doSubscriptionDelete() {
    const headers = this.headers.set(
      'Authorization',
      'Token ' + this.http_service.key
    );
    const options = {
      headers: headers
    };

    return this.http_service.doDelete(Routes.SUBSCRIPTION, options);
  }
}
