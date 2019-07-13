import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { FamilyUser } from 'src/app/model/family';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

  openSidebar = true;
  state = -1;
  users: FamilyUser[];

  lat: number = 51.678418;
  lng: number = 7.809007;

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.users = this.usersService.users.filter((user) => user.coordinate !== null);
    console.log(this.users);
    if (this.users.length < 0) {
      this.lat = this.users[0].coordinate.latitude;
      this.lng = this.users[0].coordinate.longitude;
    }
  }

  closeSidebar(){
    this.openSidebar = !this.openSidebar;
  }

}
