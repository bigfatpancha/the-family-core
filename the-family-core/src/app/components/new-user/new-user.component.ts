import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

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

  constructor() { }

  ngOnInit() {
    this.addTeacher();
    this.addMedication();
    this.addFavorite();
    this.addDislike();
    this.addWish();
    this.addRef();
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

}
