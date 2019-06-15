import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Contact, ContactResponse } from 'src/app/model/contact';
import { Observable } from 'rxjs';
import { Routes } from '../config/routes-enum';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  contacts: Contact[]

  constructor(private http_service: HttpService) { }

  doGetContacts(): Observable<ContactResponse> {
    return this.http_service.doGet(Routes.CONTACTS, {});
  }
}
