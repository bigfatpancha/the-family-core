import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';
import { EventResponse, Event } from 'src/app/model/events';
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

  doEventsGet(date?: string, type?: string): Observable<EventResponse> {
    const headers = this.headers.set('Authorization', 'Token ' + this.http_service.key);
    const params = new HttpParams();
    if (date) {
      params.set('date', date)
    }
    if (type) {
      params.set('type', type);
    }
    const options = {
      headers: headers,
      params: params
    }
    return this.http_service.doGet(Routes.EVENTS, options);
  }

  doEventPost(event: Event): Observable<Event> {
    let headers = new HttpHeaders()
          .set('accept', 'application/json')
          .set('Authorization', 'Token ' + this.http_service.key);
    const options = {
      headers: headers
    };
    return this.http_service.doPost(Routes.EVENTS, this.getFormData(event), options);
  }

  private converSnakecase(name: string): string {
    return name.split(/(?=[A-Z])/).join('_').toLowerCase();
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
    let headers = new HttpHeaders()
          .set('accept', 'application/json')
          .set('Authorization', 'Token ' + this.http_service.key);
    const options = {
      headers: headers
    }
    return this.http_service.doPut(Routes.EVENTS + id + '/', this.getFormData(event), options);
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
    return this.http_service.doDelete(Routes.EVENTS + id + '/', options);
  }

  getFormData(event: Event): FormData {
    console.log(event)
    const formData = new FormData();
    Object.keys(event).forEach(key => {
      if (key === 'address') {
        Object.keys(event[key]).forEach(key2 => formData.append(this.converSnakecase(key + '.' + key2), event[key][key2]));
      } else if (key === 'attachments') {
        let i = 0;
        for (const attachment of event[key]) {
          console.log(attachment.file);
          formData.append('attachment_' + i + '.file', attachment.file);
          i++;
        }
      } else if (key === 'familyMembers') {
        for (const member of event[key]) {
          formData.append('family_members', member.toString());
        }
      } else {
        formData.append(this.converSnakecase(key), event[key]);
      }
    });
    return formData;
  }

}
