import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';
import { Timezone } from 'src/app/model/data';
import { EventsService } from 'src/app/services/events/events.service';
import { Event } from '../../model/events';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  constructor(private dataService: DataService,
    private eventsService: EventsService) { }

  timezones: Timezone[];
  event: Event;

  ngOnInit() {
    this.dataService.doTimezoneGet()
    .subscribe((data: Timezone[]) => this.timezones = data);
  }

  doEventPost() {
    this.eventsService.doEventPost(this.event);
  }

}
