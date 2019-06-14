import { Component, OnInit } from '@angular/core';
import { ContactsService } from 'src/app/services/contacts/contacts.service';
import { UserRole } from '../../model/user';
import { FamilyUserList } from '../../model/user-list';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  state: number = 5;
  users: FamilyUserList[];

  constructor(private contactService: ContactsService) { }

  ngOnInit() {
    const data = {
      "count": 2,
      "next": null,
      "previous": null,
      "results": [
        {
          "id": 5,
          "role": 0,
          "username": "developer",
          "nickname": "",
          "avatar": null,
          "email": "lucia.julia.r@gmail.com",
          "sendbirdId": "Q5",
          "coordinate": null
        },
        {
          "id": 1,
          "role": 0,
          "username": "lepirata",
          "nickname": "",
          "avatar": null,
          "email": "martin@hourglass.tech",
          "sendbirdId": "Q1",
          "coordinate": null
        }
      ]
    }
    this.users = data.results;
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
    return this.state === 5 || this.state === type;
  }
}
