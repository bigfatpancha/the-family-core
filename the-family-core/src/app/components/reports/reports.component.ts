import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { FamilyUser } from 'src/app/model/family';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { EventsService } from 'src/app/services/events/events.service';
import { EventResponse, Event } from 'src/app/model/events';
import { DocumentResponse, Document } from 'src/app/model/documents';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  
  state = -1;
  tipeReport = 'events';
  users: FamilyUser[];
  events: Event[];
  documents: Document[];

  constructor(
    private usersService: UsersService,
    private eventsService: EventsService,
    private documentsService: DocumentsService
  ) { }

  ngOnInit() {
    this.users = this.usersService.users;
    this.eventsService.doEventsGet()
    .subscribe((res: EventResponse) => {
      this.events = res.results;
    });
    this.documentsService.doDocumentsGet()
    .subscribe((res: DocumentResponse) => {
      this.documents = res.results;
    })
  }

  formatDate(start: string) {
    return new Date(start).toUTCString();
  }

  hideEvent(event: Event) {
    const memberFound = event.familyMembers.find((mem: number) => mem === this.state);
    return this.state !== -1 && (memberFound === undefined && event.lead !== this.state);
  }

  hideDocument(doc: Document) {
    const memberFound = doc.familyMembers.find((mem: number) => mem === this.state);
    return this.state !== -1 && memberFound === undefined;
  }

}
