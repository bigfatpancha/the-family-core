import { Component, OnInit } from '@angular/core';
import { User, ReferredBy } from 'src/app/model/auth';
import { Address } from 'src/app/model/contact';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  newUser: User = new User();

  allergies: string[] = [];
  allergy = 'alergia';

  teachers: any[] = [];
  teacher = {
    teacherName: 'Ms. Homeroom',
    subject: 'Social Studies'
  };

  medications: any[] = [];
  medication = {
    name: 'Ridelin',
    dose: '2000 mg'
  };

  favorites: string[] = [];
  favorite = 'Red';

  dislikes: string[] = [];
  dislike = 'Asparagus';

  wishes: string[] = [];
  wish = 'new guitar';

  references: string[] = [];
  ref = 'Ms. Reference';

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.newUser.role = 0;
    this.newUser.address = new Address();
    this.newUser.address.state = "0";
    this.newUser.gender = 0;
    this.newUser.colorCode = 'color';
    this.newUser.hairColor = 'hair'
    this.newUser.eyeColor = 'eye';
    this.newUser.countryOfCitizenship = 'country';
    this.newUser.schoolState = 'schoolState';
    this.newUser.school = 'school';
    this.newUser.grade = 'grade';
    this.newUser.topSize = 'topSize';
    this.newUser.bottomsSize = 'bottomsSize';
    this.newUser.shoeSize = 'shoeSize';
    this.newUser.braSize = 'braSize';
    this.newUser.shirtSize = 'shirtSize';
    this.newUser.pantsSize = 'pantsSize';
    this.newUser.referredBy = new ReferredBy();
    this.newUser.referredBy.driversLicenseState = 'dlstate';
    this.newUser.referredBy.placeOfBirth = 'place';
    this.newUser.referredBy.countryOfCitizenship = 'countryOfCitizenship';
    this.addAllergy();
    this.addTeacher();
    this.addMedication();
    this.addFavorite();
    this.addDislike();
    this.addWish();
    this.addRef();
  }

  addAllergy() {
    this.allergies.push(this.allergy);
  }

  deleteAllergy(allergy) {
    this.allergies.splice(this.allergies.indexOf(allergy));
  }

  addTeacher() {
    this.teachers.push(this.teacher);
  }

  deleteTeacher(teacher) {
    this.teachers.splice(this.teachers.indexOf(teacher), 1);
  }

  addMedication() {
    this.medications.push(this.medication);
  }

  deleteMedication(medication) {
    this.medications.splice(this.medications.indexOf(medication), 1);
  }

  addFavorite() {
    this.favorites.push(this.favorite);
  }

  deleteFavorite(fav) {
    this.favorites.splice(this.favorites.indexOf(fav), 1);
  }

  addDislike() {
    this.dislikes.push(this.dislike);
  }

  deleteDislike(dis) {
    this.dislikes.splice(this.dislikes.indexOf(dis), 1);
  }

  addWish() {
    this.wishes.push(this.wish);
  }

  deleteWish(wish) {
    this.wishes.splice(this.wishes.indexOf(wish), 1);
  }

  addRef() {
    this.references.push(this.ref);
  }

  deleteRef(ref) {
    this.references.splice(this.references.indexOf(ref), 1);
  }

  saveUser() {
    console.log('LLEGA ACAAA')
    this.newUser.allergies = this.allergies;
    this.newUser.favorites = this.favorites;
    this.newUser.dislikes = this.dislikes;
    this.newUser.wishlist = this.wishes;
    // TODO revisar el tema de los referred by, solo puedo ingresar varios nombres, pero el resto de los datos me permite uno solo
    // TODO revisar el tema de las relationships
    this.usersService.doUserPost(this.newUser).subscribe((data: User) => console.log(data));
  }

  saveAndInviteUser() {

  }

}
