import { Component, OnInit } from '@angular/core';
import { User, ReferredBy } from 'src/app/model/auth';
import { Address } from 'src/app/model/contact';
import { UsersService } from 'src/app/services/users/users.service';
import { FamilyUser, FamilyUserListResponse } from 'src/app/model/family';
import { HttpService } from 'src/app/services/http/http.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  dropdownSettings = {};
  newUserForm: FormGroup;
  newUser: User = new User();

  birthDate: {
    day: number,
    month: number,
    year: number
  };
  allergy: string;

  favorites: string[];
  favorite: string;

  dislikes: string[];
  dislike: string;

  wishes: string[];
  wish: string;

  referredBy: ReferredBy;

  relationships: FamilyUser[];
  selectedRelationships: FamilyUser[];

  constructor(
    private usersService: UsersService,
    private httpService: HttpService
  ) {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'nickname'
    };
  }

  ngOnInit() {
    this.usersService.doGetUsersList()
    .subscribe((data: FamilyUserListResponse) => {
      this.relationships = data.results.filter((user: FamilyUser) => {
        user.id !== this.httpService.id;
      })
    });
    this.newUserForm = new FormGroup({
      'role': new FormControl(null),
      'username': new FormControl(null, [
        Validators.required,
        Validators.maxLength(150),
        Validators.minLength(4)
      ]),
      'nickname': new FormControl(null, [
        Validators.required,
        Validators.maxLength(150),
        Validators.minLength(4)
      ]),
      'avatar': new FormControl(null),
      'email': new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      'sendInvitation': new FormControl(null),
      'colorCode': new FormControl(null),
      'sendbirdId': new FormControl(null),
      'coordinate': new FormControl(null),
      'stars': new FormControl(null),
      'password1': new FormControl(null, [
        Validators.required
      ]),
      'password2': new FormControl(null, [
        Validators.required
      ]),
      'familyId': new FormControl(null),
      'firstName': new FormControl(null, [Validators.maxLength(30)]),
      'middleName': new FormControl(null, [Validators.maxLength(30)]),
      'lastName': new FormControl(null, [Validators.maxLength(150)]),
      'mobileNumber': new FormControl(null, [Validators.maxLength(128)]),
      'gender': new FormControl(null),
      'birthDate': new FormControl(null),
      'height': new FormControl(null, [Validators.maxLength(30)]),
      'weight': new FormControl(null, [Validators.maxLength(30)]),
      'hairColor': new FormControl(null, [Validators.maxLength(30)]),
      'eyeColor': new FormControl(null, [Validators.maxLength(30)]),
      'bloodType': new FormControl(null, [Validators.maxLength(30)]),
      'countryOfCitizenship': new FormControl(null, [Validators.maxLength(30)]),
      'passportNumber': new FormControl(null, [Validators.maxLength(30)]),
      'socialSecurityNumber':new FormControl(null, [Validators.maxLength(30)]),
      'schoolState': new FormControl(null, [Validators.maxLength(30)]),
      'school': new FormControl(null, [Validators.maxLength(30)]),
      'grade': new FormControl(null, [Validators.maxLength(30)]),
      'topSize': new FormControl(null, [Validators.maxLength(30)]),
      'bottomsSize': new FormControl(null, [Validators.maxLength(30)]),
      'shoeSize': new FormControl(null, [Validators.maxLength(30)]),
      'braSize': new FormControl(null, [Validators.maxLength(30)]),
      'shirtSize': new FormControl(null, [Validators.maxLength(30)]),
      'pantsSize': new FormControl(null, [Validators.maxLength(30)]),
      'allergies': new FormControl(null, [Validators.maxLength(32)]),
      'favorites': new FormControl(null, [Validators.maxLength(32)]),
      'dislikes': new FormControl(null, [Validators.maxLength(32)]),
      'whislist': new FormControl(null, [Validators.maxLength(32)]),
      'adminNotes': new FormControl(null),
      'addressLine1': new FormControl(null, [Validators.maxLength(128)]),
      'addressLine2': new FormControl(null, [Validators.maxLength(128)]),
      'city': new FormControl(null, [Validators.maxLength(50)]),
      'zipCode': new FormControl(null, [Validators.maxLength(50)]),
      'state': new FormControl(null, [Validators.maxLength(50)]),
      'phoneNumber': new FormControl(null, [Validators.maxLength(128)]),
      'faxNumber': new FormControl(null, [Validators.maxLength(128)]),
      'refName': new FormControl(null, [Validators.maxLength(30)]),
      'driversLicenseState': new FormControl(null, [Validators.maxLength(30)]),
      'driversLicenseNumber': new FormControl(null, [Validators.maxLength(30)]),
      'refplaceOfBirth': new FormControl(null, [Validators.maxLength(30)]),
      'refpassportNumber': new FormControl(null, [Validators.maxLength(30)]),
      'refSocSecNum': new FormControl(null, [Validators.maxLength(30)]),
      'refCountOfCit': new FormControl(null, [Validators.maxLength(30)]),
      'agency': new FormControl(null, [Validators.maxLength(30)]),
      'relationships': new FormControl(null, [Validators.maxLength(30)])
    })


    this.newUser.role = 0;
    this.newUser.address = new Address();
    this.newUser.address.state = "0";
    this.newUser.gender = 0;
    this.newUser.colorCode = 'color';
    this.newUser.countryOfCitizenship = 'country';
    this.newUser.topSize = 'topSize';
    this.newUser.bottomsSize = 'bottomsSize';
    this.newUser.shoeSize = 'shoeSize';
    this.newUser.braSize = 'braSize';
    this.newUser.shirtSize = 'shirtSize';
    this.newUser.pantsSize = 'pantsSize';
    this.referredBy = new ReferredBy();
    this.referredBy.driversLicenseState = 'dlstate';
    this.referredBy.placeOfBirth = 'place';
    this.referredBy.countryOfCitizenship = 'countryOfCitizenship';
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

  isNotActualUser(element, index, array) {
    return element !== this.httpService.id;
  }

  addFavorite() {
    if (!this.favorites) {
      this.favorites = [];
    }
    this.favorites.push(this.favorite);
    this.favorite = '';
  }

  deleteFavorite(fav) {
    this.favorites.splice(this.favorites.indexOf(fav), 1);
    this.favorite = '';
  }

  addDislike() {
    if (!this.dislikes) {
      this.dislikes = [];
    }
    this.dislikes.push(this.dislike);
    this.dislike = '';
  }

  deleteDislike(dis) {
    this.dislikes.splice(this.dislikes.indexOf(dis), 1);
    this.dislike = '';
  }

  addWish() {
    if (!this.wishes) {
      this.wishes = [];
    }
    this.wishes.push(this.wish);
    this.wish = '';
  }

  deleteWish(wish) {
    this.wishes.splice(this.wishes.indexOf(wish), 1);
    this.wish = '';
  }

  saveUser() {
    this.newUser.username = this.newUser.nickname;
    if (this.allergy) {
      this.newUser.allergies = [ this.allergy ];
    }
    this.newUser.favorites = this.favorites;
    this.newUser.dislikes = this.dislikes;
    this.newUser.wishlist = this.wishes;
    if (this.birthDate) {
      this.newUser.birthDate = this.birthDate.year + '-' + this.formatToTwoDigits(this.birthDate.month) + '-' + this.formatToTwoDigits(this.birthDate.day); 
    }
    this.newUser.referredBy = this.referredBy;
    if (this.selectedRelationships) {
      this.newUser.relationships = this.selectedRelationships.map((item) => item.id);
    }
    this.newUser.role = Number(this.newUser.role);
    console.log(this.newUser);
    this.usersService.doUserPost(this.newUser).subscribe((data: User) => console.log(data));
  }

  saveAndInviteUser() {

  }

  formatToTwoDigits(num: number): string {
    if (num < 10) {
      return '0' + num;
    }
    return num.toString();
  }

}
