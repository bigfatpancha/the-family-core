import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { UsersService } from 'src/app/services/users/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/model/auth';
import { Event, CalendarEventImpl, EventResponse } from 'src/app/model/events';
import { GenericError } from 'src/app/model/error';
import { FamilyUser } from 'src/app/model/family';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { EditUploadComponent } from '../../edit-upload/edit-upload.component';
import { DatesService } from 'src/app/services/dates/dates.service';
import { EventRecurrenceService } from 'src/app/services/event-recurrence/event-recurrence.service';
import RRule from 'rrule';

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  @Input() user: User;

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  activeDay: Date = new Date();
  today;
  showCalendar = false;
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  refresh: Subject<any> = new Subject();
  calendarEvents: CalendarEvent[];
  events: Event[];
  activeDayIsOpen: boolean = true;
  dialogConfig = new MatDialogConfig();
  editRef: MatDialogRef<EditUploadComponent>;

  constructor(
    private modal: NgbModal,
    private usersService: UsersService,
    private spinner: NgxSpinnerService,
    private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog,
    private dateService: DatesService,
    private eventRecurrence: EventRecurrenceService
  ) {}

  ngOnInit() {
    this.spinner.show();
    const today = new Date();
    this.today = today.toUTCString().substring(0,7);
    const after = new Date(today.getFullYear(), today.getMonth(), 1);
    const before = new Date(today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear(),
      today.getMonth() === 11 ? 0 : today.getMonth() + 1, 1);
    this.dayClicked({day: {date: today} });
    this.usersService.doUserIdEventByDateGet(this.user.id, this.dateService.manageTimeZone(after.toISOString(), '0'), this.dateService.manageTimeZone(before.toISOString(), '0'))
    .subscribe((res: EventResponse) => {
      let events: Event[] = this.eventRecurrence.allDatesFromRecurrence(res.results, after, before);
      this.calendarEvents = events.map((event: Event) => {
        let ev = new CalendarEventImpl()
        ev.start = new Date(event.start);
        ev.end = new Date(event.start);
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

  getTime(event: Event) {
    const date = new Date(event.start);
    return event.start ? date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : '';
  }

  getAvatar(member: number) {
    const user = this.usersService.users.find((user: FamilyUser) => user.id === member);
    return user ? user.avatar : '';
  }

  getName(member: number) {
    const user = this.usersService.users.find((user: FamilyUser) => user.id === member);
    return user ? user.nickname : '';
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  dataChange(viewDate) {
    this.activeDayIsOpen = false;
    this.spinner.show();
    const today = viewDate;
    const after = new Date(today.getFullYear(), today.getMonth(), 1);
    const before = new Date(today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear(),
      today.getMonth() === 11 ? 0 : today.getMonth() + 1, 1);
    this.today = after.toUTCString().substring(0,7);
    this.dayClicked({day: {date: after} });
    this.usersService.doUserIdEventByDateGet(this.user.id, this.dateService.manageTimeZone(after.toISOString(), '0'), this.dateService.manageTimeZone(before.toISOString(), '0'))
    .subscribe((res: EventResponse) => {
      let events: Event[] = this.eventRecurrence.allDatesFromRecurrence(res.results, after, before);
      this.calendarEvents = events.map((event: Event) => {
        let ev = new CalendarEventImpl()
        ev.start = new Date(event.start);
        ev.end = new Date(event.start);
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
    this.today = event.day.date.toUTCString().substring(0,7);
    let date = new Date(event.day.date);
    const after: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const before: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const offset = event.day.date.getTimezoneOffset() ? event.day.date.getTimezoneOffset() / 60 : new Date().getTimezoneOffset() / 60;
    this.usersService.doUserIdEventByDateGet(this.user.id, this.dateService.manageTimeZoneAfter(after, offset), this.dateService.manageTimeZoneBefore(before, offset))
      .subscribe((res: EventResponse) => {
        let events: Event[] = res.results;
        this.spinner.hide();
        this.events = events;
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

  edit(event: Event) {
    this.dialogConfig.hasBackdrop = true;
    this.dialogConfig.width = '90%';
    this.dialogConfig.height = 'auto';
    this.dialogConfig.data = {
      type: 0,
      data: event,
      userId: this.user.id
    };
    this.editRef = this.dialog.open(EditUploadComponent, this.dialogConfig);
    this.editRef.componentInstance.onEventPut.subscribe((event: Event) => this.dataChange(this.activeDay));
  }

  delete(event: Event) {
    this.spinner.show();
    this.usersService.doUserIdEventIdDelete(this.user.id, event.id)
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

