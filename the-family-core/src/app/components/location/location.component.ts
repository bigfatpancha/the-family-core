import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

  openSidebar = true;
  state = 5;

  constructor() { }

  ngOnInit() {
  }

  closeSidebar(){
    this.openSidebar = !this.openSidebar;
  }

}
