import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Contact, ContactResponse, PostContactResponse } from 'src/app/model/contact';
import { Observable } from 'rxjs';
import { Routes } from '../config/routes-enum';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  headers: HttpHeaders = new HttpHeaders({
    'accept': 'application/json',
    'Content-Type': 'application/json'
  })

  contacts: Contact[]

  constructor(private http_service: HttpService) { }

  doContactsGet(): Observable<ContactResponse> {
    const headers = this.headers.set('Authorization', 'Token ' + this.http_service.key);
    const options = {
      headers: headers
    }
    return this.http_service.doGet(Routes.CONTACTS, options);
  }

  doContactsPost(body: Contact): Observable<PostContactResponse> {
    const headers = this.headers.set('Authorization', 'Token ' + this.http_service.key);
    const options = {
      headers: headers
    }
    return this.http_service.doPost(Routes.CONTACTS, body, options);
  }

  doContactIdGet(id: number): Observable<Contact> {
    const headers = this.headers.set('Authorization', 'Token ' + this.http_service.key);
    const options = {
      headers: headers
    }
    return this.http_service.doGet(Routes.CONTACTS + id, options);
  }

  doContactIdPut(id: number, body: Contact): Observable<Contact> {
    const headers = this.headers.set('Authorization', 'Token ' + this.http_service.key);
    const options = {
      headers: headers
    }
    return this.http_service.doPut(Routes.CONTACTS + id, body, options);
  }

  doContactIdPatch(id: number, body: Contact): Observable<Contact> {
    const headers = this.headers.set('Authorization', 'Token ' + this.http_service.key);
    const options = {
      headers: headers
    }
    return this.http_service.doPatch(Routes.CONTACTS + id, body, options);
  }

  doContactIdDelete(id: number): Observable<any> {
    const headers = this.headers.set('Authorization', 'Token ' + this.http_service.key);
    const options = {
      headers: headers
    }
    return this.http_service.doDelete(Routes.CONTACTS + id, options);
  }

}
