import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { UsersService } from 'src/app/services/users/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/model/auth';
import { EventResponse, Event, CalendarEventImpl } from 'src/app/model/events';
import { GenericError } from 'src/app/model/error';
import { FamilyUser } from 'src/app/model/family';

const colors: any = {
  red: {
    primary: '#f15a24',
  },
  blue: {
    primary: '#1e90ff',
  },
  yellow: {
    primary: '#00aaff',
  }
};

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

  constructor(
    private modal: NgbModal,
    private usersService: UsersService,
    private spinner: NgxSpinnerService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.spinner.show();
    const today = new Date();
    this.today = today.toUTCString().substring(0,7);
    const after = new Date(today.getFullYear(), today.getMonth(), 1);
    const before = new Date(today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear(),
      today.getMonth() === 11 ? 0 : today.getMonth() + 1, 1);
    this.dayClicked({day: {date: today} });
    this.usersService.doUserIdEventByDateGet(this.user.id, after.toISOString(), before.toISOString())
    .subscribe((res: EventResponse) => {
      this.calendarEvents = res.results.map((event: Event) => {
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
    this.today = today.toUTCString().substring(0,7);
    const after = new Date(today.getFullYear(), today.getMonth(), 1);
    const before = new Date(today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear(),
      today.getMonth() === 11 ? 0 : today.getMonth() + 1, 1);
    this.dayClicked({day: {date: today} });
    this.usersService.doUserIdEventByDateGet(this.user.id, after.toISOString(), before.toISOString())
    .subscribe((res: EventResponse) => {
      this.calendarEvents = res.results.map((event: Event) => {
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
    const after: string = this.activeDay.toISOString();
    this.usersService.doUserIdEventByDateGet(this.user.id, after, after)
      .subscribe((res: EventResponse) => {
        this.spinner.hide();
        this.events = res.results;
        this.changeDetector.detectChanges();
        console.log(this.events);
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

}

