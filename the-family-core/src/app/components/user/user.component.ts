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
import { NgxSpinnerService } from 'ngx-spinner';
import { GenericError } from 'src/app/model/error';
import { EditUploadComponent } from '../edit-upload/edit-upload.component';

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
  editUploadRef: MatDialogRef<EditUploadComponent>;

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
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
    this.spinner.show();
    this.usersService.doUserIdGet(id)
    .subscribe((data: User) => {
      this.spinner.hide();
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
    }, (err: GenericError) => {
      this.spinner.hide();
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
    return this.user.address && this.user.address.addressLine1 !== 'null' ? this.user.address.addressLine1 : '';
  }

  getAddress2() {
    return this.user.address && this.user.address.addressLine2 !== 'null' ? this.user.address.addressLine2 : '';
  }

  getCity() {
    return this.user.address && this.user.address.city !== 'null' ? this.user.address.city : '';
  }

  getState() {
    return this.user.address && this.user.address.state !== 'null' ? this.user.address.state : '';
  }

  getZipcode() {
    return this.user.address && this.user.address.zipCode !== 'null' ? this.user.address.zipCode : '';
  }

  getPhoneNumber() {
    return this.user.address && this.user.address.phoneNumber !== 'null' ? this.user.address.phoneNumber : '';
  }

  getFaxNumber() {
    return this.user.address && this.user.address.faxNumber !== 'null' ? this.user.address.faxNumber : '';
  }

  getRefName() {
    return this.user.referredBy ? this.user.referredBy.name : '';
  }

  getRefColorCode() {
    return this.user.referredBy && this.user.referredBy.colorCode !== 'undefined' ? this.user.referredBy.colorCode : '';
  }

  getDriversLicenseState() {
    return this.user.referredBy && this.user.referredBy.driversLicenseState !== 'undefined' ? this.user.referredBy.driversLicenseState : '';
  }

  getDriversLicenseNumber() {
    return this.user.referredBy && this.user.referredBy.driversLicenseNumber !== 'undefined' ? this.user.referredBy.driversLicenseNumber : '';
  }

  getPlaceOfBirth() {
    return this.user.referredBy && this.user.referredBy.placeOfBirth !== 'undefinde' ? this.user.referredBy.placeOfBirth : '';
  }

  getSocialSecurityNumber() {
    return this.user.referredBy && this.user.referredBy.socialSecurityNumber !== 'undefined' ? this.user.referredBy.socialSecurityNumber : '';
  }

  getCountryOfCitizenship() {
    return this.user.referredBy && this.user.referredBy.countryOfCitizenship !== 'undefined' ? this.user.referredBy.countryOfCitizenship : '';
  }

  getPassportNumber() {
    return this.user.referredBy && this.user.referredBy.passportNumber !== 'undefined' ? this.user.referredBy.passportNumber : '';
  }

  getAgencyForBackgroundCheck() {
    return this.user.referredBy && this.user.referredBy.agencyForBackgroundCheck !== 'undefined' ? this.user.referredBy.agencyForBackgroundCheck : '';
  }

  getLocationAddress(loc) {
    return loc.address ? loc.address.addressLine1 : '';
  }

  doContactsType(type, state) {
    this.spinner.show();
    this.state = state;
    this.getContactsType(type);
  }

  private getContactsType(type) {
    this.usersService.doUserIdContactTypeGet(this.id, type)
    .subscribe((data: ContactResponse) => {
      this.spinner.hide();
      this.contacts = data.results;
    }, (err: GenericError) => {
      this.spinner.hide();
    })
  }

  doEventType(type, state) {
    this.spinner.show();
    this.state = state;
    this.getEventType(type);
  }

  private getEventType(type) {
    this.usersService.doUserIdEventByTypeGet(this.id, type)
    .subscribe((data: EventResponse) => {
      this.spinner.hide();
      this.events = data.results;
    }, (err: GenericError) => {
      this.spinner.hide();
    });
  }

  doDocumentType(type, state) {
    this.spinner.show();
    this.state = state;
    this.getDocumentType(type);
  }

  private getDocumentType(type) {
    this.usersService.doUserIdDocumentGet(this.id, type)
    .subscribe((data: DocumentResponse) => {
      this.spinner.hide();
      this.documents = data.results;
    }, (err: GenericError) => {
      this.spinner.hide();
    });
  }

  getUsers(state) {
    this.spinner.show();
    this.usersService.doGetUsersList()
    .subscribe((data: FamilyUserListResponse) => {
      this.spinner.hide();
      this.users = data.results;
      this.state = state;
    }, (err: GenericError) => {
      this.spinner.hide();
    });
  }

  doContacts(state) {
    this.spinner.show();
    this.usersService.doUserIdContactGet(this.id)
    .subscribe((data: ContactResponse) => {
      this.spinner.hide();
      this.contacts = data.results;
      this.state = state;
    }, (err: GenericError) => {
      this.spinner.hide();
    });
  }

  editUser() {
    this.dialogConfig.width = '90%';
    this.dialogConfig.data = this.user;
    this.editRef = this.dialog.open(EditUserComponent, this.dialogConfig);
    this.editRef.afterClosed().subscribe(() => {
      this.findUser(this.user.id);
      this.usersService.doGetUsersList().subscribe((data: FamilyUserListResponse) => this.usersService.users = data.results);
    });
  }

  openModal(type, data) {
    this.dialogConfig.hasBackdrop = true;
    this.dialogConfig.width = '90%';
    this.dialogConfig.height = 'auto';
    this.dialogConfig.data = {
      type: type,
      data: data,
      userId: this.user.id
    };
    this.editUploadRef = this.dialog.open(EditUploadComponent, this.dialogConfig);
    this.editUploadRef.componentInstance.onEventPut.subscribe((res: any) => {
      if (type === 0) {
        this.getEventType(res.type);
      } else if (type === 1) {
        this.getDocumentType(res.type);
      } else if (type === 2) {
        this.getContactsType(res.type);
      }
    });
  }

}
