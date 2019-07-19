import { Component, OnInit, Inject } from '@angular/core';
import { User, ReferredBy } from 'src/app/model/auth';
import { Address } from 'src/app/model/contact';
import { UsersService } from 'src/app/services/users/users.service';
import { FamilyUser, FamilyUserListResponse } from 'src/app/model/family';
import { HttpService } from 'src/app/services/http/http.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscriber } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { GenericError } from 'src/app/model/error';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  dropdownSettings = {};
  newUserForm: FormGroup;
  editedUser: User = new User();
  favoritesSelected: string[];
  dislikesSelected: string[];
  wishesSelected: string[];
  referredBy: ReferredBy;
  relationshipsList: FamilyUser[];
  selectedRelationships: FamilyUser[];
  imgSrc: any = '../../../assets/icono.png';
  avatarFile: any;
  idDataLoaded = false;

  constructor(
    private usersService: UsersService,
    private httpService: HttpService,
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public user: User
  ) {
    console.log(this.user);
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'nickname',
      placeholder: 'Select dependant relationship'
    };
  }

  ngOnInit() {
    this.usersService.doGetUsersList()
    .subscribe((data: FamilyUserListResponse) => {
      this.relationshipsList = data.results.filter((user: FamilyUser) => {
        return user.id !== this.httpService.id;
      });
      let birthDateNG: NgbDate = null;
      if (this.user.birthDate) {
        const year = this.user.birthDate.substring(0, 4);
        const month = this.user.birthDate.substring(5, 7);
        const day = this.user.birthDate.substring(8, 10);
        birthDateNG = new NgbDate(parseInt(year, 10), parseInt(month, 10), parseInt(day, 10));
      }
      this.favoritesSelected = this.user.favorites;
      this.dislikesSelected = this.user.dislikes;
      this.wishesSelected = this.user.wishlist;
      if (this.user.avatar) {
        this.imgSrc = this.user.avatar;
      }
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
      this.newUserForm = new FormGroup({
        'role': new FormControl(this.user.role),
        'nickname': new FormControl(this.user.nickname, [
          Validators.required,
          Validators.maxLength(150),
          Validators.minLength(4)
        ]),
        'avatar': new FormControl(null),
        'email': new FormControl(this.user.email, [
          Validators.required,
          Validators.email
        ]),
        'colorCode': new FormControl(this.user.colorCode && this.user.colorCode !== 'null' ? this.user.colorCode : null),
        'password1': new FormControl(this.user.password1),
        'password2': new FormControl(this.user.password2),
        'firstName': new FormControl(this.user.firstName && this.user.firstName !== 'null'? this.user.firstName : null, [Validators.maxLength(30)]),
        'middleName': new FormControl(this.user.middleName && this.user.middleName !== 'null' ? this.user.middleName : null, [Validators.maxLength(30)]),
        'lastName': new FormControl(this.user.lastName && this.user.lastName !== 'null'? this.user.lastName : null, [Validators.maxLength(150)]),
        'mobileNumber': new FormControl(this.user.mobileNumber && this.user.mobileNumber !== 'null' ? this.user.mobileNumber : null, [Validators.maxLength(128)]),
        'gender': new FormControl(this.user.gender),
        'birthDate': new FormControl(birthDateNG),
        'height': new FormControl(this.user.height && this.user.height !== 'null'? this.user.height : null, [Validators.maxLength(30)]),
        'weight': new FormControl(this.user.weight && this.user.weight !== 'null'? this.user.weight : null, [Validators.maxLength(30)]),
        'hairColor': new FormControl(this.user.hairColor && this.user.hairColor !== 'null'? this.user.hairColor: null, [Validators.maxLength(30)]),
        'eyeColor': new FormControl(this.user.eyeColor && this.user.eyeColor !== 'null'? this.user.eyeColor : null, [Validators.maxLength(30)]),
        'bloodType': new FormControl(this.user.bloodType && this.user.bloodType !== 'null'? this.user.bloodType : null, [Validators.maxLength(30)]),
        'countryOfCitizenship': new FormControl(this.user.countryOfCitizenship && this.user.countryOfCitizenship !== 'null'? this.user.countryOfCitizenship : null, [Validators.maxLength(30)]),
        'passportNumber': new FormControl(this.user.passportNumber && this.user.passportNumber !== 'null'? this.user.passportNumber : null, [Validators.maxLength(30)]),
        'socialSecurityNumber':new FormControl(this.user.socialSecurityNumber && this.user.socialSecurityNumber !== 'null'? this.user.socialSecurityNumber : null, [Validators.maxLength(30)]),
        'schoolState': new FormControl(this.user.schoolState && this.user.schoolState !== 'null'? this.user.schoolState : null, [Validators.maxLength(30)]),
        'school': new FormControl(this.user.school && this.user.school !== 'null'? this.user.school : null, [Validators.maxLength(30)]),
        'grade': new FormControl(this.user.grade && this.user.grade !== 'null'? this.user.grade : null, [Validators.maxLength(30)]),
        'topSize': new FormControl(this.user.topSize && this.user.topSize !== 'null'? this.user.topSize : null, [Validators.maxLength(30)]),
        'bottomsSize': new FormControl(this.user.bottomsSize && this.user.bottomsSize !== 'null'? this.user.bottomsSize : null, [Validators.maxLength(30)]),
        'shoeSize': new FormControl(this.user.shoeSize && this.user.shoeSize !== 'null'? this.user.shoeSize : null, [Validators.maxLength(30)]),
        'braSize': new FormControl(this.user.braSize && this.user.braSize !== 'null'? this.user.braSize : null, [Validators.maxLength(30)]),
        'shirtSize': new FormControl(this.user.shirtSize && this.user.shirtSize !== 'null'? this.user.shirtSize : null, [Validators.maxLength(30)]),
        'pantsSize': new FormControl(this.user.pantsSize && this.user.pantsSize !== 'null'? this.user.pantsSize : null, [Validators.maxLength(30)]),
        'allergies': new FormControl(this.user.allergies?this.user.allergies[0]:null, [Validators.maxLength(32)]),
        'favorites': new FormControl(null, [Validators.maxLength(32)]),
        'dislikes': new FormControl(null, [Validators.maxLength(32)]),
        'whislist': new FormControl(null, [Validators.maxLength(32)]),
        'adminNotes': new FormControl(this.user.adminNotes && this.user.adminNotes !== 'null'? this.user.adminNotes : null),
        'addressLine1': new FormControl(this.user.address?this.user.address.addressLine1 && this.user.address.addressLine1 !== 'null'? this.user.address.addressLine1 : null : null, [Validators.maxLength(128)]),
        'addressLine2': new FormControl(this.user.address?this.user.address.addressLine2 && this.user.address.addressLine2 !== 'null'? this.user.address.addressLine2:null:null, [Validators.maxLength(128)]),
        'city': new FormControl(this.user.address?this.user.address.city && this.user.address.city !== 'null'? this.user.address.city:null:null, [Validators.maxLength(50)]),
        'zipCode': new FormControl(this.user.address?this.user.address.zipCode && this.user.address.zipCode !== 'null'? this.user.address.zipCode:null:null, [Validators.maxLength(50)]),
        'state': new FormControl(this.user.address?this.user.address.state && this.user.address.state !== 'null'? this.user.address.state : null:null, [Validators.maxLength(50)]),
        'phoneNumber': new FormControl(this.user.address?this.user.address.phoneNumber && this.user.address.phoneNumber !== 'null'? this.user.address.phoneNumber:null:null, [Validators.maxLength(128)]),
        'faxNumber': new FormControl(this.user.address?this.user.address.faxNumber && this.user.address.faxNumber !== 'null'? this.user.address.faxNumber :null:null, [Validators.maxLength(128)]),
        'refName': new FormControl(this.user.referredBy?this.user.referredBy.name:null, [Validators.maxLength(30)]),
        'driversLicenseState': new FormControl(this.user.referredBy?this.user.referredBy.driversLicenseState:null, [Validators.maxLength(30)]),
        'driversLicenseNumber': new FormControl(this.user.referredBy?this.user.referredBy.driversLicenseNumber:null, [Validators.maxLength(30)]),
        'refplaceOfBirth': new FormControl(this.user.referredBy?this.user.referredBy.placeOfBirth:null, [Validators.maxLength(30)]),
        'refpassportNumber': new FormControl(this.user.referredBy?this.user.referredBy.passportNumber:null, [Validators.maxLength(30)]),
        'refSocSecNum': new FormControl(this.user.referredBy?this.user.referredBy.socialSecurityNumber:null, [Validators.maxLength(30)]),
        'refCountOfCit': new FormControl(this.user.referredBy?this.user.referredBy.countryOfCitizenship:null, [Validators.maxLength(30)]),
        'agency': new FormControl(this.user.referredBy?this.user.referredBy.agencyForBackgroundCheck:null, [Validators.maxLength(30)]),
        'background': new FormControl(null),
        'relationships': new FormControl(this.user.relationships, [Validators.maxLength(30)])
      });
      this.idDataLoaded = true;
      this.newUserForm.get('role').setValue(this.user.role);
    });
  }

  get role() { return this.newUserForm.get('role'); }
  get username() { return this.newUserForm.get('username'); }
  get nickname() { return this.newUserForm.get('nickname'); }
  get avatar() { return this.newUserForm.get('avatar'); }
  get email() { return this.newUserForm.get('email'); }
  get sendInvitation() { return this.newUserForm.get('sendInvitation'); }
  get colorCode() { return this.newUserForm.get('colorCode'); }
  get sendbirdId() { return this.newUserForm.get('sendbirdId'); }
  get coordinate() { return this.newUserForm.get('coordinate'); }
  get stars() { return this.newUserForm.get('stars'); }
  get password1() { return this.newUserForm.get('password1'); }
  get password2() { return this.newUserForm.get('password2'); }
  get familyId() { return this.newUserForm.get('familyId'); }
  get firstName() { return this.newUserForm.get('firstName'); }
  get middleName() { return this.newUserForm.get('middleName'); }
  get lastName() { return this.newUserForm.get('lastName'); }
  get mobileNumber() { return this.newUserForm.get('mobileNumber'); }
  get gender() { return this.newUserForm.get('gender'); }
  get birthDate() { return this.newUserForm.get('birthDate'); }
  get height() { return this.newUserForm.get('height'); }
  get weight() { return this.newUserForm.get('weight'); }
  get hairColor() { return this.newUserForm.get('hairColor'); }
  get eyeColor() { return this.newUserForm.get('eyeColor'); }
  get bloodType() { return this.newUserForm.get('bloodType'); }
  get countryOfCitizenship() { return this.newUserForm.get('countryOfCitizenship'); }
  get passportNumber() { return this.newUserForm.get('passportNumber'); }
  get socialSecurityNumber() { return this.newUserForm.get('socialSecurityNumber'); }
  get schoolState() { return this.newUserForm.get('schoolState'); }
  get school() { return this.newUserForm.get('school'); }
  get grade() { return this.newUserForm.get('grade'); }
  get topSize() { return this.newUserForm.get('topSize'); }
  get bottomsSize() { return this.newUserForm.get('bottomsSize'); }
  get shoeSize() { return this.newUserForm.get('shoeSize'); }
  get braSize() { return this.newUserForm.get('braSize'); }
  get shirtSize() { return this.newUserForm.get('shirtSize'); }
  get pantsSize() { return this.newUserForm.get('pantsSize'); }
  get allergies() { return this.newUserForm.get('allergies'); }
  get favorites() { return this.newUserForm.get('favorites'); }
  get dislikes() { return this.newUserForm.get('dislikes'); }
  get whislist() { return this.newUserForm.get('whislist'); }
  get adminNotes() { return this.newUserForm.get('adminNotes'); }
  get addressLine1() { return this.newUserForm.get('addressLine1'); }
  get addressLine2() { return this.newUserForm.get('addressLine2'); }
  get city() { return this.newUserForm.get('city'); }
  get zipCode() { return this.newUserForm.get('zipCode'); }
  get state() { return this.newUserForm.get('state'); }
  get phoneNumber() { return this.newUserForm.get('phoneNumber'); }
  get faxNumber() { return this.newUserForm.get('faxNumber'); }
  get refName() { return this.newUserForm.get('refName'); }
  get driversLicenseState() { return this.newUserForm.get('driversLicenseState'); }
  get driversLicenseNumber() { return this.newUserForm.get('driversLicenseNumber'); }
  get refplaceOfBirth() { return this.newUserForm.get('refplaceOfBirth'); }
  get refpassportNumber() { return this.newUserForm.get('refpassportNumber'); }
  get refSocSecNum() { return this.newUserForm.get('refSocSecNum'); }
  get refCountOfCit() { return this.newUserForm.get('refCountOfCit'); }
  get agency() { return this.newUserForm.get('agency'); }
  get relationships() { return this.newUserForm.get('relationships'); }
  get background() { return this.newUserForm.get('background'); }

  isNotActualUser(element) {
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
      this.getBase64(event.target.files[0]).subscribe(file => {
        this.imgSrc = file;
      });
    }
  }
  getBase64(file): Observable<string> {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return Observable.create((observer: Subscriber<string | ArrayBuffer>): void => {
      // if success
      reader.onload = ((ev: ProgressEvent): void => {
        observer.next(reader.result);
        observer.complete();
      });

      // if failed
      reader.onerror = (error: ProgressEvent): void => {
        observer.error(error);
      };
    });
  }

  saveUser() {
    if (this.newUserForm.status === 'VALID') {
      if (this.nickname.value) {
        this.editedUser.nickname = this.nickname.value;
        this.editedUser.username = this.nickname.value;
      }
      if (this.email.value) {
        this.editedUser.email = this.email.value;
      }
      if (this.allergies.value) {
        this.editedUser.allergies = [ this.allergies.value ];
      }
      if (this.favoritesSelected) {
        this.editedUser.favorites = this.favoritesSelected;
      }
      if (this.dislikesSelected) {
        this.editedUser.dislikes = this.dislikesSelected;
      }
      if (this.wishesSelected) {
        this.editedUser.wishlist = this.wishesSelected;
      }
      if (this.birthDate.value) {
        this.editedUser.birthDate = this.birthDate.value.year + '-' +
          this.formatToTwoDigits(this.birthDate.value.month) + '-' +
          this.formatToTwoDigits(this.birthDate.value.day);
      }
      if (this.isRefEdited()) {
        if (!this.user.referredBy) {
          this.editedUser.referredBy = new ReferredBy();
        } else {
          this.editedUser.referredBy = this.user.referredBy;
        }
        if (this.refName.value) {
          this.editedUser.referredBy.name = this.refName.value;
        }
        if (this.driversLicenseState.value) {
          this.editedUser.referredBy.driversLicenseState = this.driversLicenseState.value;
        }
        if (this.driversLicenseNumber.value) {
          this.editedUser.referredBy.driversLicenseNumber = this.driversLicenseNumber.value;
        }
        if (this.refCountOfCit.value) {
          this.editedUser.referredBy.countryOfCitizenship = this.refCountOfCit.value;
        }
        if (this.agency.value) {
          this.editedUser.referredBy.agencyForBackgroundCheck = this.agency.value;
        }
        if (this.passportNumber.value) {
          this.editedUser.referredBy.passportNumber = this.passportNumber.value;
        }
        if (this.refplaceOfBirth.value) {
          this.editedUser.referredBy.placeOfBirth = this.refplaceOfBirth.value;
        }
        if (this.refSocSecNum.value) {
          this.editedUser.referredBy.socialSecurityNumber = this.refSocSecNum.value;
        }
      }
      if (this.selectedRelationships) {
        this.editedUser.relationships = this.selectedRelationships.map((item) => item.id);
      }
      if (this.role.value) {
        this.editedUser.role = this.role.value;
      }
      if (this.colorCode.value) {
        this.editedUser.colorCode = this.colorCode.value;
      }
      if (this.password1.value) {
        this.editedUser.password1 = this.password1.value;
      }
      if (this.password2.value) {
        this.editedUser.password2 = this.password2.value;
      }
      if (this.firstName.value) {
        this.editedUser.firstName = this.firstName.value;
      }
      if (this.middleName.value) {
        this.editedUser.middleName = this.middleName.value;
      }
      if (this.lastName.value) {
        this.editedUser.lastName = this.lastName.value;
      }
      if (this.mobileNumber.value) {
        this.editedUser.mobileNumber = this.mobileNumber.value;
      }
      if (this.gender.value) {
        this.editedUser.gender = this.gender.value;
      }
      if (this.height.value) {
        this.editedUser.height = this.height.value;
      }
      if (this.weight.value) {
        this.editedUser.weight = this.weight.value;
      }
      if (this.hairColor.value) {
        this.editedUser.hairColor = this.hairColor.value;
      }
      if (this.eyeColor.value) {
        this.editedUser.eyeColor = this.eyeColor.value;
      }
      if (this.bloodType.value) {
        this.editedUser.bloodType = this.bloodType.value;
      }
      if (this.countryOfCitizenship.value) {
        this.editedUser.countryOfCitizenship = this.countryOfCitizenship.value;
      }
      if (this.passportNumber.value) {
        this.editedUser.passportNumber = this.passportNumber.value;
      }
      if (this.socialSecurityNumber.value) {
        this.editedUser.socialSecurityNumber = this.socialSecurityNumber.value;
      }
      if (this.schoolState.value) {
        this.editedUser.schoolState = this.schoolState.value;
      }
      if (this.school.value) {
        this.editedUser.school = this.school.value;
      }
      if (this.grade.value) {
        this.editedUser.grade = this.grade.value;
      }
      if (this.topSize.value) {
        this.editedUser.topSize = this.topSize.value;
      }
      if (this.bottomsSize.value) {
        this.editedUser.bottomsSize = this.bottomsSize.value;
      }
      if (this.shoeSize.value) {
        this.editedUser.shoeSize = this.shoeSize.value;
      }
      if (this.braSize.value) {
        this.editedUser.braSize = this.braSize.value;
      }
      if (this.shirtSize.value) {
        this.editedUser.shirtSize = this.shirtSize.value;
      }
      if (this.pantsSize.value) {
        this.editedUser.pantsSize = this.pantsSize.value;
      }
      if (this.adminNotes.value) {
        this.editedUser.adminNotes = this.adminNotes.value;
      }
      if (this.isAddressEdited()) {
        if (!this.user.address) {
          this.editedUser.address = new Address();
        } else {
          this.editedUser.address = this.user.address;
        }
        if (this.addressLine1.value) {
          this.editedUser.address.addressLine1 = this.addressLine1.value;
        }
        if (this.addressLine2.value) {
          this.editedUser.address.addressLine2 = this.addressLine2.value;
        }
        if (this.city.value) {
          this.editedUser.address.city = this.city.value;
        }
        if (this.faxNumber.value) {
          this.editedUser.address.faxNumber = this.faxNumber.value;
        }
        if (this.phoneNumber.value) {
          this.editedUser.address.phoneNumber = this.phoneNumber.value;
        }
        if (this.state.value) {
          this.editedUser.address.state = this.state.value;
        }
        if (this.zipCode.value) {
          this.editedUser.address.zipCode = this.zipCode.value;
        }
      }

      if (this.avatarFile) {
        this.editedUser.avatar = this.avatarFile;
      }
      this.usersService.doUserIdPut(this.user.id, this.editedUser).subscribe((data: User) => {
        this.dialogRef.close();
        alert('Profile edited successfully');
      }, (err: GenericError) => {
        let message = '';
        Object.keys(err.error).forEach((key: string) => {
          message += key + ': ' + err.error[key][0] + '.\n';
        });
        alert('Something went wrong, please try again.\n' + message);
      });
    } else {
      this.newUserForm.markAllAsTouched();
    }
  }

  close() {
    this.dialogRef.close();
  }

  saveAndInviteUser() {

  }

  formatToTwoDigits(num: number): string {
    if (num < 10) {
      return '0' + num;
    }
    return num.toString();
  }

  isAddressEdited(): boolean {
    return (this.addressLine1.value || this.addressLine2.value || this.city.value || this.faxNumber.value ||
      this.phoneNumber.value || this.state.value || this.zipCode.value);
  }

  isRefEdited(): boolean {
    return (this.refName.value || this.driversLicenseState.value || this.driversLicenseNumber.value || this.refCountOfCit.value ||
      this.agency.value || this.passportNumber.value || this.refplaceOfBirth.value || this.refSocSecNum.value);
  }

}
