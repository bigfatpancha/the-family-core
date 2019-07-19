import { Component, OnInit, AfterContentInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { User } from 'src/app/model/auth';
import { ActivatedRoute } from '@angular/router';
import { UserRole, FamilyUser, FamilyUserListResponse } from 'src/app/model/family';
import { ContactResponse, Contact } from '../../model/contact';
import { EventResponse, Event } from '../../model/events';
import { DocumentResponse, Document } from '../../model/documents';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { EditUserComponent } from '../edit-user/edit-user.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, AfterContentInit {

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

  isDataLoaded = false;

  state = 'userInfo';
  user: User;
  id: number;
  contacts: Contact[];
  events: Event[];
  documents: Document[];
  users: FamilyUser[];
  selectedRelationships: FamilyUser[];
  editRef: MatDialogRef<EditUserComponent>;
  dialogConfig = new MatDialogConfig();

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.dialogConfig.hasBackdrop = true;
    this.dialogConfig.width = 'auto';
    this.dialogConfig.height = 'auto';
  }

  ngAfterContentInit() {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.findUser(this.id);
   });
  }

  findUser(id: number) {
    this.usersService.doUserIdGet(id)
    .subscribe((data: User) => {
      this.user = data;
      this.isDataLoaded = true;
      if (this.user.relationships) {
        this.selectedRelationships = [];
        this.user.relationships.forEach((id: number) => {
          this.usersService.users.forEach((user: FamilyUser) => {
            if (id === user.id) {
              this.selectedRelationships.push(user);
            }
          });
        });
      }
    });

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
    if (role === 0) {
      return UserRole.ADMIN;
    } else if (role === 1) {
      return UserRole.LEGAL_GUARDIAN;
    } else if (role === 2) {
      return UserRole.CHILD;
    } else if (role === 3) {
      return UserRole.DEPENDENT;
    } else {
      return UserRole.NANNY;
    }
  }

  getAddress1() {
    return this.user.address ? this.user.address.addressLine1 : '';
  }

  getAddress2() {
    return this.user.address ? this.user.address.addressLine2 : '';
  }

  getCity() {
    return this.user.address ? this.user.address.city : '';
  }

  getState() {
    return this.user.address ? this.user.address.state : '';
  }

  getZipcode() {
    return this.user.address ? this.user.address.zipCode : '';
  }

  getPhoneNumber() {
    return this.user.address ? this.user.address.phoneNumber : '';
  }

  getFaxNumber() {
    return this.user.address ? this.user.address.faxNumber : '';
  }

  getRefName() {
    return this.user.referredBy ? this.user.referredBy.name : '';
  }

  getRefColorCode() {
    return this.user.referredBy ? this.user.referredBy.colorCode : '';
  }

  getDriversLicenseState() {
    return this.user.referredBy ? this.user.referredBy.driversLicenseState : '';
  }

  getDriversLicenseNumber() {
    return this.user.referredBy ? this.user.referredBy.driversLicenseNumber : '';
  }

  getPlaceOfBirth() {
    return this.user.referredBy ? this.user.referredBy.placeOfBirth : '';
  }

  getSocialSecurityNumber() {
    return this.user.referredBy ? this.user.referredBy.socialSecurityNumber : '';
  }

  getCountryOfCitizenship() {
    return this.user.referredBy ? this.user.referredBy.countryOfCitizenship : '';
  }

  getPassportNumber() {
    return this.user.referredBy ? this.user.referredBy.passportNumber : '';
  }

  getAgencyForBackgroundCheck() {
    return this.user.referredBy ? this.user.referredBy.agencyForBackgroundCheck : '';
  }

  doContactsType(type, state) {
    this.usersService.doUserIdContactTypeGet(this.id, type)
    .subscribe((data: ContactResponse) => {
      this.contacts = data.results;
      this.state = state;
    })
  }

  doEventType(type, state) {
    this.usersService.doUserIdEventGet(this.id, type, {}, {})
    .subscribe((data: EventResponse) => {
      this.events = data.results;
      this.state = state;
    });
  }

  doDocumentType(type, state) {
    this.usersService.doUserIdDocumentGet(this.id, type)
    .subscribe((data: DocumentResponse) => {
      this.documents = data.results;
      this.state = state;
    });
  }

  getUsers(state) {
    this.usersService.doGetUsersList()
    .subscribe((data: FamilyUserListResponse) => {
      this.users = data.results;
      this.state = state;
    });
  }

  doContacts(state) {
    this.usersService.doUserIdContactGet(this.id)
    .subscribe((data: ContactResponse) => {
      this.contacts = data.results;
      this.state = state;
    });
  }

  editUser() {
    this.dialogConfig.width = '90%';
    this.dialogConfig.data = this.user;
    this.editRef = this.dialog.open(EditUserComponent, this.dialogConfig);
    this.editRef.afterClosed().subscribe(() => {
      this.findUser(this.user.id);
    });
  }

}
