import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';
import { EventResponse } from 'src/app/model/events';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Routes } from '../config/routes-enum';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  headers: HttpHeaders = new HttpHeaders();

  constructor(private http_service: HttpService) {
    this.headers = this.headers.set('accept', 'application/json')
                               .set('Content-Type', 'application/json');
  }

  doEventsGet(date: string, type: string): Observable<EventResponse> {
    const headers = this.headers.set('Authorization', 'Token ' + this.http_service.key);
    const params = new HttpParams().set('date', date).set('type', type);
    const options = {
      headers: headers,
      params: params
    }
    return this.http_service.doGet(Routes.EVENTS, options);
  }

  doEventPost(event: Event): Observable<Event> {
    const headers = this.headers.set('Authorization', 'Token ' + this.http_service.key);
    const options = {
      headers: headers
    }
    return this.http_service.doPost(Routes.EVENTS, event, options);
  }

  doEventCountGet(date: string, type: string): Observable<EventResponse> {
    const headers = this.headers.set('Authorization', 'Token ' + this.http_service.key);
    const params = new HttpParams().set('date', date).set('type', type);
    const options = {
      headers: headers,
      params: params
    }
    return this.http_service.doGet(Routes.EVENTS_COUNT, options);
  }

  doEventIdGet(id: number): Observable<Event> {
    const headers = this.headers.set('Authorization', 'Token ' + this.http_service.key);
    const options = {
      headers: headers
    }
    return this.http_service.doGet(Routes.EVENTS + id, options);
  }

  doEventIdPut(id:number, event: Event): Observable<Event> {
    const headers = this.headers.set('Authorization', 'Token ' + this.http_service.key);
    const options = {
      headers: headers
    }
    return this.http_service.doPut(Routes.EVENTS + id, event, options);
  }

  doEventIdPatch(id:number, event: Event): Observable<Event> {
    const headers = this.headers.set('Authorization', 'Token ' + this.http_service.key);
    const options = {
      headers: headers
    }
    return this.http_service.doPatch(Routes.EVENTS + id, event, options);
  }

  doEventIdDelete(id: number): Observable<any> {
    const headers = this.headers.set('Authorization', 'Token ' + this.http_service.key);
    const options = {
      headers: headers
    }
    return this.http_service.doDelete(Routes.EVENTS + id, options);
  }

}
