import { Component, OnInit } from '@angular/core';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { DevicesResponse, FCMDevice } from 'src/app/model/devices';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

  openSidebar = true;
  state = -1;
  devices: FCMDevice[];

  lat: number = 51.678418;
  lng: number = 7.809007;

  constructor(private devicesService: DevicesService) { }

  ngOnInit() {
    this.devicesService.doDevicesGet()
    .subscribe((res: DevicesResponse) => {
      this.devices = res.results
    });
  }

  closeSidebar(){
    this.openSidebar = !this.openSidebar;
  }

}
