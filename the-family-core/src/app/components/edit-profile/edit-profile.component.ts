import { Component, OnInit } from '@angular/core';
import { User, ReferredBy } from 'src/app/model/auth';
import { Address } from 'src/app/model/contact';
import { UsersService } from 'src/app/services/users/users.service';
import { FamilyUser, FamilyUserListResponse } from 'src/app/model/family';
import { HttpService } from 'src/app/services/http/http.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  dropdownSettings = {};
  newUser: User = new User();
  editUserForm: FormGroup;

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
    // this.newUser.referredBy = this.referredBy;
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
