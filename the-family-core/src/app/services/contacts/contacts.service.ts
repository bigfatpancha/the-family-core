import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Contact } from 'src/app/model/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  contacts: Contact[]

  constructor(private http_service: HttpService) { }

  doGetContacts() {
    this.http_service.doGet(Routes.CONTACTS, {})
    .subscribe((data: Contact[]) => this.contacts = data);
  }
}
