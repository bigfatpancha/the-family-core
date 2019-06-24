import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { User } from 'src/app/model/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  state = 'userInfo';
  user: User;
  id: number;

  constructor(private usersService: UsersService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.findUser(this.id);
   });    
  }

  findUser(id: number) {
    let address = {
      id: 1,
      addressLine1: 'calle falsa 123',
      addressLine2: 'linea 2',
      city: 'CABA',
      zipCode: '1408',
      state: 'CABA'
    }
    this.user = {
      "id": 5,
      "role": 2,
      "username": "developer",
      "nickname": "developer",
      "avatar": "../../../assets/nino.jpg",
      "familyId": 4,
      "email": "lucia.julia.r@gmail.com",
      "sendbirdId": "Q5",
      "firstName": "lucia",
      "middleName": "",
      "lastName": "julia",
      "gender": 0,
      "mobileNumber": '123-123-123',
      "birthDate": '06-06-06',
      "height": '1.62',
      "weight": '54',
      "hairColor": 'brown',
      "eyeColor": 'brown',
      "bloodType": 'A+',
      "countryOfCitizenship": 'USA',
      "passportNumber": '35353535',
      "socialSecurityNumber": '1111233',
      "schoolState": 'State',
      "school": 'School',
      "grade": '4',
      "topSize": 'S',
      "bottomsSize": 'S',
      "shoeSize": '7.5',
      "braSize": '90',
      "shirtSize": 'M',
      "pantsSize": 'M',
      "allergies": ['dust'],
      "favorites": ['Red', 'Mac & cheese'],
      "dislikes": ['Liquid cough medicine', 'Asparagus'],
      "wishlist": ['new guitar', 'ipad'],
      "adminNotes": "estas son las notas del admin",
      "address": address,
      "referredBy": ['Ms. Ref'],
      "relationships": ['father']
    }
    // this.usersService.doUserIdGet(id)
    // .subscribe((data: User) => this.user = data);
  }

  formatGender(gender: number) {
    return gender === 0 ? 'Male' : 'Female';
  }

}
