import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { User } from 'src/app/model/auth';
import { ActivatedRoute } from '@angular/router';
import { UserRole, FamilyUser, FamilyUserListResponse } from 'src/app/model/family';
import { ContactResponse, Contact } from '../../model/contact';
import { EventResponse, Event } from '../../model/events';
import { DocumentResponse, Document } from '../../model/documents';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  
  DOCTORS = '0';
  TEACHER = '1';
  CLASSMATE = '2';
  LOCATION = '3';
  
  TASK = '1';
  APPOINTMENTS = '2';

  GENERAL = '0';
  RECORDS = '1';
  RX = '2';
  LEGAL = '3';

  state = 'userInfo';
  user: User;
  id: number;
  contacts: Contact[];
  events: Event[];
  documents: Document[];
  users: FamilyUser[];

  constructor(private usersService: UsersService,
    private route: ActivatedRoute) {
      this.route.params.subscribe(params => {
        this.id = +params['id'];
        this.findUser(this.id);
     }); 
    }

  ngOnInit() { }

  findUser(id: number) {
    this.usersService.doUserIdGet(id)
    .subscribe((data: User) => this.user = data);
  }

  formatGender(gender: number) {
    return gender === 0 ? 'Male' : gender === 1 ? 'Female' : 'Other';
  }

  isChildDependent() {
    if (this.user) {
      return this.user.role === 2 || this.user.role === 3;
    }
    return false;
    
  }

  formatRole(role) {
    if(role === 0){
      return UserRole.ADMIN;
    } else if (role === 1){
      return UserRole.LEGAL_GUARDIAN;
    } else if (role === 2) {
      return UserRole.CHILD;
    } else if (role === 3){
      return UserRole.DEPENDENT;
    } else{
      return UserRole.NANNY;
    }
  }

  doContactsType(type, state) {
    this.usersService.doUserIdContactTypeGet(this.id, type)
    .subscribe((data: ContactResponse) => {
      this.contacts = data.results
      this.state = state;
    })
  }

  doEventType(type, state) {
    this.usersService.doUserIdEventGet(this.id, type, {}, {})
    .subscribe((data: EventResponse) => {
      this.events = data.results;
      this.state = state;
    })
  }

  doDocumentType(type, state) {
    this.usersService.doUserIdDocumentGet(this.id, type)
    .subscribe((data: DocumentResponse) => {
      this.documents = data.results;
      this.state = state;
    })
  }

  getUsers(state) {
    this.usersService.doGetUsersList()
    .subscribe((data: FamilyUserListResponse) => {
      this.users = data.results;
      this.state = state;
    })
  }

  doContacts(state) {
    this.usersService.doUserIdContactGet(this.id)
    .subscribe((data: ContactResponse) => {
      this.contacts = data.results
      this.state = state;
    })
  }

}
