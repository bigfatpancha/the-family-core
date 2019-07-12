import { Component, OnInit } from '@angular/core';
import { User, ReferredBy } from 'src/app/model/auth';
import { Address } from 'src/app/model/contact';
import { UsersService } from 'src/app/services/users/users.service';
import { FamilyUser, FamilyUserListResponse } from 'src/app/model/family';
import { HttpService } from 'src/app/services/http/http.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscriber } from 'rxjs';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {


  dropdownSettings = {};
  newUserForm: FormGroup;
  user: User = new User();
  favoritesSelected: string[];
  dislikesSelected: string[];
  wishesSelected: string[];
  referredBy: ReferredBy;
  relationshipsList: FamilyUser[];
  selectedRelationships: FamilyUser[];
  imgSrc = '../../../assets/icono.png';
  avatarFile: any;
  idDataLoaded = false;

  constructor(
    private usersService: UsersService,
    private httpService: HttpService,
    public dialogRef: MatDialogRef<EditProfileComponent>
  ) {
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
      
      this.usersService.doUserIdGet(this.httpService.id)
      .subscribe((user: User) => {
        this.usersService.user = user;
        this.user = user;
        this.favoritesSelected = this.user.favorites;
        this.dislikesSelected = this.user.dislikes;
        this.wishesSelected = this.user.wishlist;
        if (this.user.avatar) {
          this.getBase64(this.user.avatar)
          .subscribe(file => this.imgSrc = file);
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
          'colorCode': new FormControl(this.user.colorCode),
          'password1': new FormControl(this.user.password1, [
            Validators.required
          ]),
          'password2': new FormControl(this.user.password2, [
            Validators.required
          ]),
          'firstName': new FormControl(this.user.firstName, [Validators.maxLength(30)]),
          'middleName': new FormControl(this.user.middleName, [Validators.maxLength(30)]),
          'lastName': new FormControl(this.user.lastName, [Validators.maxLength(150)]),
          'mobileNumber': new FormControl(this.user.mobileNumber, [Validators.maxLength(128)]),
          'gender': new FormControl(this.user.gender),
          'birthDate': new FormControl(null), // TODO pars birthdate
          'height': new FormControl(this.user.height, [Validators.maxLength(30)]),
          'weight': new FormControl(this.user.weight, [Validators.maxLength(30)]),
          'hairColor': new FormControl(this.user.hairColor, [Validators.maxLength(30)]),
          'eyeColor': new FormControl(this.user.eyeColor, [Validators.maxLength(30)]),
          'bloodType': new FormControl(this.user.bloodType, [Validators.maxLength(30)]),
          'countryOfCitizenship': new FormControl(this.user.countryOfCitizenship, [Validators.maxLength(30)]),
          'passportNumber': new FormControl(this.user.passportNumber, [Validators.maxLength(30)]),
          'socialSecurityNumber':new FormControl(this.user.socialSecurityNumber, [Validators.maxLength(30)]),
          'schoolState': new FormControl(this.user.schoolState, [Validators.maxLength(30)]),
          'school': new FormControl(this.user.school, [Validators.maxLength(30)]),
          'grade': new FormControl(this.user.grade, [Validators.maxLength(30)]),
          'topSize': new FormControl(this.user.topSize, [Validators.maxLength(30)]),
          'bottomsSize': new FormControl(this.user.bottomsSize, [Validators.maxLength(30)]),
          'shoeSize': new FormControl(this.user.shoeSize, [Validators.maxLength(30)]),
          'braSize': new FormControl(this.user.braSize, [Validators.maxLength(30)]),
          'shirtSize': new FormControl(this.user.shirtSize, [Validators.maxLength(30)]),
          'pantsSize': new FormControl(this.user.pantsSize, [Validators.maxLength(30)]),
          'allergies': new FormControl(this.user.allergies?this.user.allergies[0]:null, [Validators.maxLength(32)]),
          'favorites': new FormControl(null, [Validators.maxLength(32)]),
          'dislikes': new FormControl(null, [Validators.maxLength(32)]),
          'whislist': new FormControl(null, [Validators.maxLength(32)]),
          'adminNotes': new FormControl(this.user.adminNotes),
          'addressLine1': new FormControl(this.user.address?this.user.address.addressLine1:null, [Validators.maxLength(128)]),
          'addressLine2': new FormControl(this.user.address?this.user.address.addressLine2:null, [Validators.maxLength(128)]),
          'city': new FormControl(this.user.address?this.user.address.city:null, [Validators.maxLength(50)]),
          'zipCode': new FormControl(this.user.address?this.user.address.zipCode:null, [Validators.maxLength(50)]),
          'state': new FormControl(this.user.address?this.user.address.state:null, [Validators.maxLength(50)]),
          'phoneNumber': new FormControl(this.user.address?this.user.address.phoneNumber:null, [Validators.maxLength(128)]),
          'faxNumber': new FormControl(this.user.address?this.user.address.faxNumber:null, [Validators.maxLength(128)]),
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
        })
        this.idDataLoaded = true;
      });
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
    console.log(this.avatarFile);
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
      this.user.nickname = this.nickname.value;
      this.user.username = this.nickname.value;
      this.user.email = this.email.value;
      if (this.allergies.value) {
        this.user.allergies = [ this.allergies.value ];
      }
      if (!this.favoritesSelected && this.favoritesSelected !== undefined) {
        this.user.favorites = this.favoritesSelected;
      }
      if (!this.dislikesSelected && this.dislikesSelected !== undefined) {
        this.user.dislikes = this.dislikesSelected;
      }
      if (!this.wishesSelected && this.wishesSelected !== undefined) {
        this.user.wishlist = this.wishesSelected;
      }
      if (this.birthDate.value) {
        this.user.birthDate = this.birthDate.value.year + '-' +
          this.formatToTwoDigits(this.birthDate.value.month) + '-' +
          this.formatToTwoDigits(this.birthDate.value.day);
      }
      if (this.isRefEdited() && !this.user.referredBy) {
        this.user.referredBy = new ReferredBy();
        if (this.refName.value) {
          this.user.referredBy.name = this.refName.value;
        }
        if (this.driversLicenseState.value) {
          this.user.referredBy.driversLicenseState = this.driversLicenseState.value;
        }
        if (this.driversLicenseNumber.value) {
          this.user.referredBy.driversLicenseNumber = this.driversLicenseNumber.value;
        }
        if (this.refCountOfCit.value) {
          this.user.referredBy.countryOfCitizenship = this.refCountOfCit.value;  
        }
        if (this.agency.value) {
          this.user.referredBy.agencyForBackgroundCheck = this.agency.value;
        }
        if (this.passportNumber.value) {
          this.user.referredBy.passportNumber = this.passportNumber.value;
        }
        if (this.refplaceOfBirth.value) {
          this.user.referredBy.placeOfBirth = this.refplaceOfBirth.value;  
        }
        if (this.refSocSecNum.value) {
          this.user.referredBy.socialSecurityNumber = this.refSocSecNum.value;
        }
      }
      if (this.selectedRelationships) {
        this.user.relationships = this.selectedRelationships.map((item) => item.id);
      }
      if (this.role.value) {
        this.user.role = this.role.value;
      }
      if (this.colorCode.value) {
        this.user.colorCode = this.colorCode.value;
      }
      if (this.password1.value) {
        this.user.password1 = this.password1.value;
      }
      if (this.password2.value) {
        this.user.password2 = this.password2.value;
      }
      if (this.firstName.value) {
        this.user.firstName = this.firstName.value;
      }
      if (this.middleName.value) {
        this.user.middleName = this.middleName.value;
      }
      if (this.lastName.value) {
        this.user.lastName = this.lastName.value;
      }
      if (this.mobileNumber.value) {
        this.user.mobileNumber = this.mobileNumber.value;
      }
      if (this.gender.value) {
        this.user.gender = this.gender.value;
      }
      if (this.height.value) {
        this.user.height = this.height.value;
      }
      if (this.weight.value) {
        this.user.weight = this.weight.value;
      }
      if (this.hairColor.value) {
        this.user.hairColor = this.hairColor.value;
      }
      if (this.eyeColor.value) {
        this.user.eyeColor = this.eyeColor.value;
      }
      if (this.bloodType.value) {
        this.user.bloodType = this.bloodType.value;
      }
      if (this.countryOfCitizenship.value) {
        this.user.countryOfCitizenship = this.countryOfCitizenship.value;
      }
      if (this.passportNumber.value) {
        this.user.passportNumber = this.passportNumber.value;
      }
      if (this.socialSecurityNumber.value) {
        this.user.socialSecurityNumber = this.socialSecurityNumber.value;
      }
      if (this.schoolState.value) {
        this.user.schoolState = this.schoolState.value;
      }
      if (this.school.value) {
        this.user.school = this.school.value;
      }
      if (this.grade.value) {
        this.user.grade = this.grade.value;
      }
      if (this.topSize.value) {
        this.user.topSize = this.topSize.value;
      }
      if (this.bottomsSize.value) {
        this.user.bottomsSize = this.bottomsSize.value;
      }
      if (this.shoeSize.value) {
        this.user.shoeSize = this.shoeSize.value;
      }
      if (this.braSize.value) {
        this.user.braSize = this.braSize.value;
      }
      if (this.shirtSize.value) {
        this.user.shirtSize = this.shirtSize.value;
      }
      if (this.pantsSize.value) {
        this.user.pantsSize = this.pantsSize.value;
      }
      if (this.adminNotes.value) {
        this.user.adminNotes = this.adminNotes.value;
      }
      if (this.isAddressEdited() && !this.user.address) {
        this.user.address = new Address();
        if (this.addressLine1.value) {
          this.user.address.addressLine1 = this.addressLine1.value;
        }
        if (this.addressLine2.value) {
          this.user.address.addressLine2 = this.addressLine2.value;
        }
        if (this.city.value) {
          this.user.address.city = this.city.value;
        }
        if (this.faxNumber.value) {
          this.user.address.faxNumber = this.faxNumber.value;
        }
        if (this.phoneNumber.value) {
          this.user.address.phoneNumber = this.phoneNumber.value;
        }
        if (this.state.value) {
          this.user.address.state = this.state.value;
        }
        if (this.zipCode.value) {
          this.user.address.zipCode = this.zipCode.value;
        }
      }
      
      if (this.avatarFile) {
        this.user.avatar = this.avatarFile;
      }
      console.log(this.user);
      this.usersService.doUserIdPut(this.user.id, this.user).subscribe((data: User) => {
        console.log(data);
        this.dialogRef.close();
        alert('Profile edited successfully');
      }, (err: Error) => {
        alert('Something went wrong, please try again ' + err.name);
      });
    } else {
      alert('the form is invalid ' + JSON.stringify(this.newUserForm.errors));
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
