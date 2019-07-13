import { Component, OnInit, AfterContentInit, ViewChild, AfterViewInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { FamilyUser, Coordinate } from 'src/app/model/family';
import { AgmMap, LatLngBounds, LatLng } from '@agm/core';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit, AfterViewInit {

  @ViewChild('mapa', {static: false}) agmMap: AgmMap;

  openSidebar = true;
  state = -1;
  users: FamilyUser[];
  userSelected: FamilyUser;

  lat: number = 51.678418;
  lng: number = 7.809007;

  constructor(private usersService: UsersService) {
    this.userSelected = new FamilyUser();
    this.userSelected.coordinate = new Coordinate();
    this.userSelected.coordinate.latitude = 51.678418;
    this.userSelected.coordinate.longitude = 7.809007;
  }

  ngOnInit() {
    this.users = this.usersService.users.filter((user) => user.coordinate !== null);
    this.selectAll();
  }

  ngAfterViewInit() {
    // console.log(this.agmMap);
    // this.agmMap.mapReady.subscribe(map => {
    //   const bounds: LatLngBounds = new LatLngBounds();
    //   for (const mm of this.users.map((user: FamilyUser) => user.coordinate)) {
    //     bounds.extend(new LatLng(mm.latitude, mm.longitude));
    //   }
    //   map.fitBounds(bounds);
    // });
  }

  selectAll() {
    this.state = -1;
    if (this.users.length < 0) {
      this.userSelected = this.users[0];
      console.log(this.userSelected);
    }
  }

  selectUser(user: FamilyUser) {
    this.state = user.id;
    this.userSelected = user;
  }

  resizeIcon(url: string) {
    return {
      url: url, 
      scaledSize: {
        height: 40,
        width: 20
      }
    }
  }

  closeSidebar(){
    this.openSidebar = !this.openSidebar;
  }

}
