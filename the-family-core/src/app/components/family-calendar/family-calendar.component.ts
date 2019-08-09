import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CalendarView, CalendarEvent } from 'angular-calendar';
import { Subject } from 'rxjs';
import { Event, CalendarEventImpl, EventResponse } from 'src/app/model/events';
import { FamilyUser } from 'src/app/model/family';
import { UsersService } from 'src/app/services/users/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { EditUploadComponent } from '../edit-upload/edit-upload.component';
import { GenericError } from 'src/app/model/error';
import { EventsService } from 'src/app/services/events/events.service';

@Component({
  selector: 'app-family-calendar',
  templateUrl: './family-calendar.component.html',
  styleUrls: ['./family-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FamilyCalendarComponent implements OnInit {

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  activeDay: Date = new Date();
  calendarEvents: CalendarEvent[];
  refresh: Subject<any> = new Subject();
  events: Event[];
  dialogConfig = new MatDialogConfig();
  editRef: MatDialogRef<EditUploadComponent>;
  today;
  showCalendar = false;
  activeDayIsOpen: boolean = true;

  constructor(
    private usersService: UsersService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private eventsService: EventsService,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.spinner.show();
    const today = new Date();
    this.today = today.toUTCString().substring(0,7);
    const after = new Date(today.getFullYear(), today.getMonth(), 1);
    const before = new Date(today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear(),
      today.getMonth() === 11 ? 0 : today.getMonth() + 1, 1);
    this.dayClicked({day: {date: today} });
    this.eventsService.doEventsCalendarGet(after, before)
      .subscribe((res: EventResponse) => {
        let events: Event[] = res.results;
        this.calendarEvents = events.map((event: Event) => {
          let ev = new CalendarEventImpl()
          ev.start = new Date(event.start);
          ev.end = new Date(event.end);
          ev.title = event.title;
          return ev;
        });
        this.showCalendar = true;
        this.refresh.next();
        this.spinner.hide();
        this.changeDetector.detectChanges();
      }, (err: GenericError) => {
        this.spinner.hide();
        let message = 'Error: ';
        Object.keys(err.error).forEach(key => {
          if (Array.isArray(err.error[key])) {
            err.error[key].forEach(msg => {
              message += msg + ' ';
            });
          } else {
            message += err.error;
          }            
          message += '\n';
        });
        alert('Something went wrong, please try again\n' + message);
      })
  }

  dataChange(viewDate: Date) {
    this.activeDayIsOpen = false;
    this.spinner.show();
    const today = viewDate;
    this.today = today.toUTCString().substring(0,7);
    const after = new Date(today.getFullYear(), today.getMonth(), 1);
    const before = new Date(today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear(),
      today.getMonth() === 11 ? 0 : today.getMonth() + 1, 1);
    this.dayClicked({day: {date: today} });
    this.eventsService.doEventsCalendarGet(after.toISOString(), before.toISOString())
    .subscribe((res: EventResponse) => {
      let events: Event[] = res.results;
      this.calendarEvents = events.map((event: Event) => {
        let ev = new CalendarEventImpl()
        ev.start = new Date(event.start);
        ev.end = new Date(event.end);
        ev.title = event.title;
        return ev;
      });
      this.showCalendar = true;
      this.refresh.next();
      this.spinner.hide();
      this.changeDetector.detectChanges();
    }, (err: GenericError) => {
      this.spinner.hide();
      let message = 'Error: ';
      Object.keys(err.error).forEach(key => {
        if (Array.isArray(err.error[key])) {
          err.error[key].forEach(msg => {
            message += msg + ' ';
          });
        } else {
          message += err.error;
        }            
        message += '\n';
      });
      alert('Something went wrong, please try again\n' + message);
    })
  }

  dayClicked(event) {
    this.spinner.show();
    this.activeDay = event.day.date;
    let date = new Date(event.day.date);
    const after: string = this.activeDay.toISOString();
    const before: string = new Date(date.setDate(date.getDate() + 1)).toISOString();
    this.eventsService.doEventsCalendarGet(after, before)
      .subscribe((res: EventResponse) => {
        this.events = res.results;
        this.spinner.hide();
        this.changeDetector.detectChanges();
      }, (err: GenericError) => {
        this.spinner.hide();
        let message = 'Error: ';
        Object.keys(err.error).forEach(key => {
          if (Array.isArray(err.error[key])) {
            err.error[key].forEach(msg => {
              message += msg + ' ';
            });
          } else {
            message += err.error;
          }            
          message += '\n';
        });
        alert('Something went wrong, please try again\n' + message);
      });
  }

  getTime(event: Event) {
    const date = new Date(event.start);
    return event.start ? date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : '';
  }

  getName(member: number) {
    const user = this.usersService.users.find((user: FamilyUser) => user.id === member);
    return user ? user.nickname : '';
  }

  getAddress(event: Event) {
    let address = '';
    if (event.address) {
      if (event.address.addressLine1) {
        address += event.address.addressLine1;
      }
      if (event.address.addressLine2) {
        address += ' ' + event.address.addressLine2;
      }
      if (event.address.city) {
        address += ', ' +event.address.city;
      }
      if (event.address.state) {
        address += ', ' + event.address.state;
      }
    }
    return address;
  }

  getAvatar(member: number) {
    const user = this.usersService.users.find((user: FamilyUser) => user.id === member);
    return user ? user.avatar : '';
  }

  edit(event: Event) {
    this.dialogConfig.hasBackdrop = true;
    this.dialogConfig.width = '90%';
    this.dialogConfig.height = 'auto';
    this.dialogConfig.data = {
      type: 0,
      data: event
    };
    this.editRef = this.dialog.open(EditUploadComponent, this.dialogConfig);
    this.editRef.componentInstance.onEventPut.subscribe((event: Event) => this.dataChange(this.activeDay));
  }

  delete(event: Event) {
    this.spinner.show();
    this.usersService.doUserIdEventIdDelete(this.usersService.user.id, event.id)
    .subscribe(() => {
      this.spinner.hide();
      alert('event deleted');
      this.dataChange(this.activeDay);
    }, (err: GenericError) => {
      this.spinner.hide();
      let message = 'Error: ';
      Object.keys(err.error).forEach(key => {
        if (Array.isArray(err.error[key])) {
          err.error[key].forEach(msg => {
            message += msg + ' ';
          });
        } else {
          message += err.error;
        }            
        message += '\n';
      });
      alert('Something went wrong, please try again\n' + message);
    })
  }

  getEventsListFromResponse(response: any): Event[] {
    let events: Event[] = [];
    Object.keys(response).forEach(key => {
      response[key].forEach((event: Event) => {
        events.push(event);
      })
    })
    return events;
  }

}
