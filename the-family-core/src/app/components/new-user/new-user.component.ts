import { Component, OnInit } from '@angular/core';
import { User, ReferredBy } from 'src/app/model/auth';
import { Address } from 'src/app/model/contact';
import { UsersService } from 'src/app/services/users/users.service';
import {
  FamilyUser,
  UserId
} from 'src/app/model/family';
import { HttpService } from 'src/app/services/http/http.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscriber } from 'rxjs';
import { MatDialogRef } from '@angular/material';
import { GenericError } from 'src/app/model/error';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
  dropdownSettings = {};
  newUserForm: FormGroup;
  newUser: User = new User();
  favoritesSelected: string[];
  dislikesSelected: string[];
  wishesSelected: string[];
  referredBy: ReferredBy;
  relationshipsList: FamilyUser[];
  selectedRelationships: FamilyUser[];
  imgSrc = '../../../assets/icono.webp';
  avatarFile: any;

  constructor(
    private usersService: UsersService,
    private httpService: HttpService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<NewUserComponent>
  ) {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'nickname',
      placeholder: 'Select dependant relationship'
    };
  }

  ngOnInit() {
    const userslist: FamilyUser[] = [...this.usersService.users];
    this.relationshipsList = userslist.filter((user: FamilyUser) => {
      return user.id !== this.httpService.id;
    });
    this.newUserForm = new FormGroup({
      role: new FormControl(null),
      nickname: new FormControl(null, [
        Validators.required,
        Validators.maxLength(150),
        Validators.minLength(4)
      ]),
      avatar: new FormControl(null),
      email: new FormControl(null, [Validators.required, Validators.email]),
      sendInvitation: new FormControl(null),
      colorCode: new FormControl(null),
      sendbirdId: new FormControl(null),
      coordinate: new FormControl(null),
      stars: new FormControl(null),
      password1: new FormControl(null, [Validators.required]),
      password2: new FormControl(null, [Validators.required]),
      familyId: new FormControl(null),
      firstName: new FormControl(null, [Validators.maxLength(30)]),
      middleName: new FormControl(null, [Validators.maxLength(30)]),
      lastName: new FormControl(null, [Validators.maxLength(150)]),
      mobileNumber: new FormControl(null, [Validators.maxLength(128)]),
      gender: new FormControl(null),
      birthDate: new FormControl(null),
      height: new FormControl(null, [Validators.maxLength(30)]),
      weight: new FormControl(null, [Validators.maxLength(30)]),
      hairColor: new FormControl(null, [Validators.maxLength(30)]),
      eyeColor: new FormControl(null, [Validators.maxLength(30)]),
      bloodType: new FormControl(null, [Validators.maxLength(30)]),
      countryOfCitizenship: new FormControl(null, [Validators.maxLength(30)]),
      passportNumber: new FormControl(null, [Validators.maxLength(30)]),
      socialSecurityNumber: new FormControl(null, [Validators.maxLength(30)]),
      schoolState: new FormControl(null, [Validators.maxLength(30)]),
      school: new FormControl(null, [Validators.maxLength(30)]),
      grade: new FormControl(null, [Validators.maxLength(30)]),
      topSize: new FormControl(null, [Validators.maxLength(30)]),
      bottomsSize: new FormControl(null, [Validators.maxLength(30)]),
      shoeSize: new FormControl(null, [Validators.maxLength(30)]),
      braSize: new FormControl(null, [Validators.maxLength(30)]),
      shirtSize: new FormControl(null, [Validators.maxLength(30)]),
      pantsSize: new FormControl(null, [Validators.maxLength(30)]),
      allergies: new FormControl(null, [Validators.maxLength(32)]),
      favorites: new FormControl(null, [Validators.maxLength(32)]),
      dislikes: new FormControl(null, [Validators.maxLength(32)]),
      whislist: new FormControl(null, [Validators.maxLength(32)]),
      adminNotes: new FormControl(null),
      addressLine1: new FormControl(null, [Validators.maxLength(128)]),
      addressLine2: new FormControl(null, [Validators.maxLength(128)]),
      city: new FormControl(null, [Validators.maxLength(50)]),
      zipCode: new FormControl(null, [Validators.maxLength(50)]),
      state: new FormControl(null, [Validators.maxLength(50)]),
      phoneNumber: new FormControl(null, [Validators.maxLength(128)]),
      faxNumber: new FormControl(null, [Validators.maxLength(128)]),
      refName: new FormControl(null, [Validators.maxLength(30)]),
      refColorCode: new FormControl(null),
      driversLicenseState: new FormControl(null, [Validators.maxLength(30)]),
      driversLicenseNumber: new FormControl(null, [Validators.maxLength(30)]),
      refplaceOfBirth: new FormControl(null, [Validators.maxLength(30)]),
      refpassportNumber: new FormControl(null, [Validators.maxLength(30)]),
      refSocSecNum: new FormControl(null, [Validators.maxLength(30)]),
      refCountOfCit: new FormControl(null, [Validators.maxLength(30)]),
      agency: new FormControl(null, [Validators.maxLength(30)]),
      background: new FormControl(null),
      relationships: new FormControl([], [Validators.maxLength(30)])
    });

    this.newUser.address = new Address();
    this.referredBy = new ReferredBy();
  }

  get role() {
    return this.newUserForm.get('role');
  }
  get username() {
    return this.newUserForm.get('username');
  }
  get nickname() {
    return this.newUserForm.get('nickname');
  }
  get avatar() {
    return this.newUserForm.get('avatar');
  }
  get email() {
    return this.newUserForm.get('email');
  }
  get sendInvitation() {
    return this.newUserForm.get('sendInvitation');
  }
  get colorCode() {
    return this.newUserForm.get('colorCode');
  }
  get sendbirdId() {
    return this.newUserForm.get('sendbirdId');
  }
  get coordinate() {
    return this.newUserForm.get('coordinate');
  }
  get stars() {
    return this.newUserForm.get('stars');
  }
  get password1() {
    return this.newUserForm.get('password1');
  }
  get password2() {
    return this.newUserForm.get('password2');
  }
  get familyId() {
    return this.newUserForm.get('familyId');
  }
  get firstName() {
    return this.newUserForm.get('firstName');
  }
  get middleName() {
    return this.newUserForm.get('middleName');
  }
  get lastName() {
    return this.newUserForm.get('lastName');
  }
  get mobileNumber() {
    return this.newUserForm.get('mobileNumber');
  }
  get gender() {
    return this.newUserForm.get('gender');
  }
  get birthDate() {
    return this.newUserForm.get('birthDate');
  }
  get height() {
    return this.newUserForm.get('height');
  }
  get weight() {
    return this.newUserForm.get('weight');
  }
  get hairColor() {
    return this.newUserForm.get('hairColor');
  }
  get eyeColor() {
    return this.newUserForm.get('eyeColor');
  }
  get bloodType() {
    return this.newUserForm.get('bloodType');
  }
  get countryOfCitizenship() {
    return this.newUserForm.get('countryOfCitizenship');
  }
  get passportNumber() {
    return this.newUserForm.get('passportNumber');
  }
  get socialSecurityNumber() {
    return this.newUserForm.get('socialSecurityNumber');
  }
  get schoolState() {
    return this.newUserForm.get('schoolState');
  }
  get school() {
    return this.newUserForm.get('school');
  }
  get grade() {
    return this.newUserForm.get('grade');
  }
  get topSize() {
    return this.newUserForm.get('topSize');
  }
  get bottomsSize() {
    return this.newUserForm.get('bottomsSize');
  }
  get shoeSize() {
    return this.newUserForm.get('shoeSize');
  }
  get braSize() {
    return this.newUserForm.get('braSize');
  }
  get shirtSize() {
    return this.newUserForm.get('shirtSize');
  }
  get pantsSize() {
    return this.newUserForm.get('pantsSize');
  }
  get allergies() {
    return this.newUserForm.get('allergies');
  }
  get favorites() {
    return this.newUserForm.get('favorites');
  }
  get dislikes() {
    return this.newUserForm.get('dislikes');
  }
  get whislist() {
    return this.newUserForm.get('whislist');
  }
  get adminNotes() {
    return this.newUserForm.get('adminNotes');
  }
  get addressLine1() {
    return this.newUserForm.get('addressLine1');
  }
  get addressLine2() {
    return this.newUserForm.get('addressLine2');
  }
  get city() {
    return this.newUserForm.get('city');
  }
  get zipCode() {
    return this.newUserForm.get('zipCode');
  }
  get state() {
    return this.newUserForm.get('state');
  }
  get phoneNumber() {
    return this.newUserForm.get('phoneNumber');
  }
  get faxNumber() {
    return this.newUserForm.get('faxNumber');
  }
  get refName() {
    return this.newUserForm.get('refName');
  }
  get refColorCode() {
    return this.newUserForm.get('refColorCode');
  }
  get driversLicenseState() {
    return this.newUserForm.get('driversLicenseState');
  }
  get driversLicenseNumber() {
    return this.newUserForm.get('driversLicenseNumber');
  }
  get refplaceOfBirth() {
    return this.newUserForm.get('refplaceOfBirth');
  }
  get refpassportNumber() {
    return this.newUserForm.get('refpassportNumber');
  }
  get refSocSecNum() {
    return this.newUserForm.get('refSocSecNum');
  }
  get refCountOfCit() {
    return this.newUserForm.get('refCountOfCit');
  }
  get agency() {
    return this.newUserForm.get('agency');
  }
  get relationships() {
    return this.newUserForm.get('relationships');
  }
  get background() {
    return this.newUserForm.get('background');
  }

  isNotActualUser(element, index, array) {
    return element !== this.httpService.id;
  }

  addFavorite() {
    if (!this.favoritesSelected) {
      this.favoritesSelected = [];
    }
    this.favoritesSelected.push(this.favorites.value);
    this.favorites.setValue(null);
  }

  deleteFavorite(fav) {
    this.favoritesSelected.splice(this.favoritesSelected.indexOf(fav), 1);
    this.favorites.setValue(null);
    if (this.favoritesSelected.length === 0) {
      this.favoritesSelected = null;
    }
  }

  addDislike() {
    if (!this.dislikesSelected) {
      this.dislikesSelected = [];
    }
    this.dislikesSelected.push(this.dislikes.value);
    this.dislikes.setValue(null);
  }

  deleteDislike(dis) {
    this.dislikesSelected.splice(this.dislikesSelected.indexOf(dis), 1);
    this.dislikes.setValue(null);
    if (this.dislikesSelected.length === 0) {
      this.dislikesSelected = null;
    }
  }

  addWish() {
    if (!this.wishesSelected) {
      this.wishesSelected = [];
    }
    this.wishesSelected.push(this.whislist.value);
    this.whislist.setValue(null);
  }

  deleteWish(wish) {
    this.wishesSelected.splice(this.wishesSelected.indexOf(wish), 1);
    this.whislist.setValue(null);
    if (this.wishesSelected.length === 0) {
      this.wishesSelected = null;
    }
  }

  processImg(event) {
    if (event.target.files.length > 0) {
      this.avatarFile = event.target.files[0];
      console.log(this.avatarFile);
      this.getBase64(event.target.files[0]).subscribe(file => {
        this.imgSrc = file;
      });
    }
  }
  getBase64(file): Observable<string> {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return Observable.create(
      (observer: Subscriber<string | ArrayBuffer>): void => {
        // if success
        reader.onload = (ev: ProgressEvent): void => {
          observer.next(reader.result);
          observer.complete();
        };

        // if failed
        reader.onerror = (error: ProgressEvent): void => {
          observer.error(error);
        };
      }
    );
  }

  saveUser() {
    if (this.newUserForm.status === 'VALID') {
      this.spinner.show();
      this.generateUser();
      this.usersService.doUserPost(this.newUser).subscribe(
        (data: User) => {
          this.spinner.hide();
          this.dialogRef.close();
          alert('User created successfully');
        },
        (err: GenericError) => {
          this.spinner.hide();
          let message = '';
          Object.keys(err.error).forEach((key: string) => {
            message += key + ': ' + err.error[key][0] + '.\n';
          });
          alert('Something went wrong, please try again.\n' + message);
        }
      );
    } else {
      this.newUserForm.markAllAsTouched();
    }
  }

  saveAndInviteUser() {
    if (this.newUserForm.status === 'VALID') {
      this.spinner.show();
      this.generateUser();
      this.usersService.doUserPost(this.newUser).subscribe(
        (data: User) => {
          const body = new UserId();
          body.id = data.id;
          this.usersService.doUsersIdSendInvitePost(body).subscribe(
            (res: UserId) => {
              this.spinner.hide();
              alert('user created.');
            },
            (err: GenericError) => {
              this.spinner.hide();
              let message = '';
              Object.keys(err.error).forEach((key: string) => {
                message += key + ': ' + err.error[key][0] + '.\n';
              });
              alert('Something went wrong, please try again.\n' + message);
            }
          );
        },
        (err: GenericError) => {
          this.spinner.hide();
          let message = '';
          Object.keys(err.error).forEach((key: string) => {
            message += key + ': ' + err.error[key][0] + '.\n';
          });
          alert('Something went wrong, please try again.\n' + message);
        }
      );
    }
  }

  generateUser() {
    this.newUser.nickname = this.nickname.value;
    this.newUser.username = this.nickname.value;
    this.newUser.email = this.email.value;
    if (this.allergies.dirty) {
      this.newUser.allergies = [this.allergies.value];
    }
    if (!this.favoritesSelected && this.favoritesSelected !== undefined) {
      this.newUser.favorites = this.favoritesSelected;
    }
    if (!this.dislikesSelected && this.dislikesSelected !== undefined) {
      this.newUser.dislikes = this.dislikesSelected;
    }
    if (!this.wishesSelected && this.wishesSelected !== undefined) {
      this.newUser.wishlist = this.wishesSelected;
    }
    if (this.birthDate.dirty) {
      this.newUser.birthDate =
        this.birthDate.value.year +
        '-' +
        this.formatToTwoDigits(this.birthDate.value.month) +
        '-' +
        this.formatToTwoDigits(this.birthDate.value.day);
    }
    if (this.refName.dirty) {
      this.referredBy.name = this.refName.value;
    }
    if (this.refColorCode.dirty) {
      this.newUser.colorCode = this.refColorCode.value;
    }
    if (this.driversLicenseState.dirty) {
      this.referredBy.driversLicenseState = this.driversLicenseState.value;
    }
    if (this.driversLicenseNumber.dirty) {
      this.referredBy.driversLicenseNumber = this.driversLicenseNumber.value;
    }
    if (this.countryOfCitizenship.dirty) {
      this.referredBy.countryOfCitizenship = this.refCountOfCit.value;
    }
    if (this.agency.dirty) {
      this.referredBy.agencyForBackgroundCheck = this.agency.value;
    }
    if (this.passportNumber.dirty) {
      this.referredBy.passportNumber = this.passportNumber.value;
    }
    if (this.refplaceOfBirth.dirty) {
      this.referredBy.placeOfBirth = this.refplaceOfBirth.value;
    }
    if (this.refSocSecNum.dirty) {
      this.referredBy.socialSecurityNumber = this.refSocSecNum.value;
    }
    if (this.refName.dirty) {
      this.newUser.referredBy = this.referredBy;
    }

    if (this.selectedRelationships) {
      this.newUser.relationships = this.selectedRelationships.map(
        item => item.id
      );
    }
    if (this.role.dirty) {
      this.newUser.role = this.role.value;
    }
    if (this.colorCode.dirty) {
      this.newUser.colorCode = this.colorCode.value;
    }
    if (this.password1.dirty) {
      this.newUser.password1 = this.password1.value;
    }
    if (this.password2.dirty) {
      this.newUser.password2 = this.password2.value;
    }
    if (this.firstName.dirty) {
      this.newUser.firstName = this.firstName.value;
    }
    if (this.middleName.dirty) {
      this.newUser.middleName = this.middleName.value;
    }
    if (this.lastName.dirty) {
      this.newUser.lastName = this.lastName.value;
    }
    if (this.mobileNumber.dirty) {
      this.newUser.mobileNumber = this.mobileNumber.value;
    }
    if (this.gender.dirty) {
      this.newUser.gender = this.gender.value;
    }
    if (this.height.dirty) {
      this.newUser.height = this.height.value;
    }
    if (this.weight.dirty) {
      this.newUser.weight = this.weight.value;
    }
    if (this.hairColor.dirty) {
      this.newUser.hairColor = this.hairColor.value;
    }
    if (this.eyeColor.dirty) {
      this.newUser.eyeColor = this.eyeColor.value;
    }
    if (this.bloodType.dirty) {
      this.newUser.bloodType = this.bloodType.value;
    }
    if (this.countryOfCitizenship.dirty) {
      this.newUser.countryOfCitizenship = this.countryOfCitizenship.value;
    }
    if (this.passportNumber.dirty) {
      this.newUser.passportNumber = this.passportNumber.value;
    }
    if (this.socialSecurityNumber.dirty) {
      this.newUser.socialSecurityNumber = this.socialSecurityNumber.value;
    }
    if (this.schoolState.dirty) {
      this.newUser.schoolState = this.schoolState.value;
    }
    if (this.school.dirty) {
      this.newUser.school = this.school.value;
    }
    if (this.grade.dirty) {
      this.newUser.grade = this.grade.value;
    }
    if (this.topSize.dirty) {
      this.newUser.topSize = this.topSize.value;
    }
    if (this.bottomsSize.dirty) {
      this.newUser.bottomsSize = this.bottomsSize.value;
    }
    if (this.shoeSize.dirty) {
      this.newUser.shoeSize = this.shoeSize.value;
    }
    if (this.braSize.dirty) {
      this.newUser.braSize = this.braSize.value;
    }
    if (this.shirtSize.dirty) {
      this.newUser.shirtSize = this.shirtSize.value;
    }
    if (this.pantsSize.dirty) {
      this.newUser.pantsSize = this.pantsSize.value;
    }
    if (this.adminNotes.dirty) {
      this.newUser.adminNotes = this.adminNotes.value;
    }
    if (this.addressLine1.dirty) {
      this.newUser.address.addressLine1 = this.addressLine1.value;
    }
    if (this.addressLine2.dirty) {
      this.newUser.address.addressLine2 = this.addressLine2.value;
    }
    if (this.city.dirty) {
      this.newUser.address.city = this.city.value;
    }
    if (this.faxNumber.dirty) {
      this.newUser.address.faxNumber = this.faxNumber.value;
    }
    if (this.phoneNumber.dirty) {
      this.newUser.address.phoneNumber = this.phoneNumber.value;
    }
    if (this.state.dirty) {
      this.newUser.address.state = this.state.value;
    }
    if (this.zipCode.dirty) {
      this.newUser.address.zipCode = this.zipCode.value;
    }
    if (this.avatarFile) {
      this.newUser.avatar = this.avatarFile;
    }
  }

  close() {
    this.dialogRef.close();
  }

  formatToTwoDigits(num: number): string {
    if (num < 10) {
      return '0' + num;
    }
    return num.toString();
  }
}
