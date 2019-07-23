import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit, Input } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
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
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  @Input() user: User;

  view: CalendarView = CalendarView.Month;

  // CalendarView = CalendarView;

  viewDate: Date = new Date();
  today;
  showCalendar = false;

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  // actions: CalendarEventAction[] = [
  //   {
  //     label: '<i class="icon-edit iconos-calendar"></i>',
  //     onClick: ({ event }: { event: CalendarEvent }): void => {
  //       this.handleEvent('Edited', event);
  //     }
  //   },
  //   {
  //     label: '<i class="icon-delete iconos-calendar"></i>',
  //     onClick: ({ event }: { event: CalendarEvent }): void => {
  //       this.calendarEvents = this.calendarEvents.filter(iEvent => iEvent !== event);
  //       this.handleEvent('Deleted', event);
  //     }
  //   }
  // ];

  refresh: Subject<any> = new Subject();

  calendarEvents: CalendarEvent[];
  events: Event[];

  activeDayIsOpen: boolean = true;

  constructor(
    private modal: NgbModal,
    private usersService: UsersService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();
    const today = new Date();
    this.today = today.toUTCString().substring(0,7);
    const after = new Date(today.getFullYear(), today.getMonth(), 1);
    const before = new Date(today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear(),
      today.getMonth() === 11 ? 0 : today.getMonth() + 1, 1);
    this.usersService.doUserIdEventByDateGet(this.user.id, after.toISOString(), before.toISOString())
    .subscribe((res: EventResponse) => {
      this.events = res.results;
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
    return event.start ? date.toLocaleTimeString() : '';
  }

  getAvatar(event) {
    const user = this.usersService.users.find((user: FamilyUser) => user.id === event.lead);
    return user ? user.avatar : '';
  }

  getLeadName(event: Event) {
    const user = this.usersService.users.find((user: FamilyUser) => user.id === event.lead);
    return user ? user.nickname : '';
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  // eventTimesChanged({
  //   event,
  //   newStart,
  //   newEnd
  // }: CalendarEventTimesChangedEvent): void {
  //   this.calendarEvents = this.events.map(iEvent => {
  //     if (iEvent === event) {
  //       return {
  //         ...event,
  //         start: newStart,
  //         end: newEnd
  //       };
  //     }
  //     return iEvent;
  //   });
  //   this.handleEvent('Dropped or resized', event);
  // }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  // addEvent(): void {
  //   this.events = [
  //     ...this.events,
  //     {
  //       title: 'New event',
  //       start: startOfDay(new Date()),
  //       end: endOfDay(new Date()),
  //       color: colors.red,
  //       draggable: true,
  //       resizable: {
  //         beforeStart: true,
  //         afterEnd: true
  //       }
  //     }
  //   ];
  // }

  // deleteEvent(eventToDelete: CalendarEvent) {
  //   this.events = this.events.filter(event => event !== eventToDelete);
  // }

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
    this.usersService.doUserIdEventByDateGet(this.user.id, after.toISOString(), before.toISOString())
    .subscribe((res: EventResponse) => {
      this.events = res.results;
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
}

