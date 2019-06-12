import { Component, OnInit } from '@angular/core';
import { ContactsService } from 'src/app/services/contacts/contacts.service';
import { ContactResponse, Contact } from 'src/app/model/contact';
import { UserRole } from 'src/app/model/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  state = 'All';
  contacts: Contact[];

  constructor(private contactService: ContactsService) { }

  ngOnInit() {
    const data = {
      "count": 3,
      "next": null,
      "previous": null,
      "results": [
        {
          "id": 3,
          "type": 2,
          "name": "A Classmate",
          "detail": null,
          "email": 'lala@lala.com',
          "phoneNumber": '123-123-123',
          "avatar": null,
          "familyMembers": [
            1,
            2,
            3,
            4,
            5
          ],
          "notifyTeam": false,
          "notes": "",
          "address": null
        },
        {
          "id": 2,
          "type": 1,
          "name": "Miss Teacher",
          "detail": null,
          "email": 'okka@lala.com',
          "phoneNumber": '423-6745-567',
          "avatar": null,
          "familyMembers": [
            1,
            2,
            3,
            4,
            5
          ],
          "notifyTeam": false,
          "notes": "",
          "address": null
        },
        {
          "id": 1,
          "type": 0,
          "name": "Dr Doctor",
          "detail": null,
          "email": 'nela@lala.com',
          "phoneNumber": '5345-765-758',
          "avatar": null,
          "familyMembers": [
            1,
            2,
            3,
            4,
            5
          ],
          "notifyTeam": false,
          "notes": "",
          "address": null
        }
      ]
    }
    this.contacts = data.results;
    // this.contactService.doGetContacts()
    // .subscribe((data: ContactResponse) => this.contacts = data.results);
  }

  formatType(type) {
    if (type === 0) {
      return UserRole.ADMIN;
    } else if (type === 1) {
      return UserRole.LEGAL_GUARDIAN;
    } else if (type === 2) {
      return UserRole.CHILD;
    } else if (type === 3) {
      return UserRole.DEPENDENT;
    } else {
      return UserRole.NANNY;
    }
  }

  showContact(type) {
    return this.state === 'All' || this.state === type;
  }
}
