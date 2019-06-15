import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Contact, ContactResponse } from 'src/app/model/contact';
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

  doGetContacts(): Observable<ContactResponse> {
    this.headers.set('Authorization', 'Token ' + this.http_service.key )
    const options = {
      headers: this.headers
    }
    return this.http_service.doGet(Routes.CONTACTS, options);
  }
}
