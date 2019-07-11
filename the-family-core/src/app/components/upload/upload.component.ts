import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';
import { Timezone } from 'src/app/model/data';
import { EventsService } from 'src/app/services/events/events.service';
import { Event, EventAttachment } from '../../model/events';
import { UsersService } from 'src/app/services/users/users.service';
import { FamilyUser, FamilyUserListResponse } from 'src/app/model/family';
import { Attachment } from 'src/app/model/documents';
import { Address } from 'src/app/model/contact';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RRule } from 'rrule'
import { Observable, Subscriber } from 'rxjs';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  @Output() onEventPost = new EventEmitter<boolean>();

  constructor(
    private dataService: DataService,
    private eventsService: EventsService,
    private userService: UsersService,
    public dialogRef: MatDialogRef<UploadComponent>
  ) { }

  eventForm: FormGroup;

  ariaValuenow = 0;
  timezones: Timezone[];
  event: Event = new Event();
  isFamilyMemberFormValid = false;
  familyMembersSelected: FamilyUser[];
  familyMembers: FamilyUser[];

  lead: FamilyUser;
  leadSelected: FamilyUser[];

  progress: number;
  attachments: Attachment[];

  startDate: NgbDate;
  startTime: NgbDate;
  endDate: any;
  endTime: any;
  isValidTime = true;

  date: Date;
  dayOfWeek: string;
  dayOfMonth: string;
  dayOfYear: string;
  activeSun = false;
  activeMon = false;
  activeTue = false;
  activeWed = false;
  activeTur = false;
  activeFri = false;
  activeSat = false;
  until: Date;
  count: number;

  ngOnInit() {
    this.dataService.doTimezoneGet()
    .subscribe((data: Timezone[]) => {
      this.timezones = data;
    });
    this.userService.doGetUsersList()
    .subscribe((res: FamilyUserListResponse) => {
      this.familyMembers = res.results;
    })
    this.date = new Date();
    this.startDate = new NgbDate(this.date.getFullYear(), this.date.getMonth() + 1, this.date.getDate());
    this.dayOfWeek = this.formatDayOfWeek(this.date.getDay());
    this.dayOfMonth = this.date.getDate().toString() + this.getGetOrdinal(this.date.getDate());
    this.dayOfYear = this.formatMonth(this.date.getMonth()) + ' ' + this.dayOfMonth;
    this.event.address = new Address();
    this.progress = 0;

    this.eventForm = new FormGroup({
      'title': new FormControl(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30)
      ]),
      'detail': new FormControl(null, [Validators.maxLength(30)]),
      'type': new FormControl(0, [Validators. required]),
      'familyMemberForm': new FormControl(null),
      'leadForm': new FormControl(null),
      'dpstart': new FormControl(this.startDate, [Validators.required]),
      'startTimeForm': new FormControl(this.startTime, [Validators.required]),
      'dpend': new FormControl(this.endDate, [Validators.required]),
      'endTimeForm': new FormControl(this.endTime, [Validators.required]),
      'timezone': new FormControl(null, [Validators.required]),
      'alert': new FormControl(0),
      'recurrence': new FormControl('Doesnotrepeat'),
      'endsForm': new FormControl('Never'),
      'recurrenceEndDateForm': new FormControl(this.startDate),
      'recurrenceOcurrencesForm': new FormControl(null),
      'customRepeatForm': new FormControl(1),
      'customFrecuenceForm': new FormControl('Day'),
      'addressLine1': new FormControl(null, [Validators.maxLength(128)]),
      'addressLine2': new FormControl(null, [Validators.maxLength(128)]),
      'city': new FormControl(null, [Validators.maxLength(50)]),
      'state': new FormControl(null),
      'zip': new FormControl(null, [Validators.maxLength(50)]),
      'phoneNumber': new FormControl(null, [Validators.maxLength(128)]),
      'fax': new FormControl(null, [Validators.maxLength(128)]),
      'notes': new FormControl(null),
      'notifyTeam': new FormControl(false)
    });
  }

  get title() { return this.eventForm.get('title'); }
  get detail() { return this.eventForm.get('detail'); }
  get type() { return this.eventForm.get('type'); }
  get familyMemberForm() { return this.eventForm.get('familyMemberForm'); }
  get leadForm() { return this.eventForm.get('leadForm'); }
  get dpstart() { return this.eventForm.get('dpstart'); }
  get startTimeForm() { return this.eventForm.get('startTimeForm'); }
  get dpend() { return this.eventForm.get('dpend'); }
  get endTimeForm() { return this.eventForm.get('endTimeForm'); }
  get timezone() { return this.eventForm.get('timezone'); }
  get alert() { return this.eventForm.get('alert'); }
  get recurrence() { return this.eventForm.get('recurrence'); }
  get endsForm() { return this.eventForm.get('endsForm'); }
  get recurrenceEndDateForm() { return this.eventForm.get('recurrenceEndDateForm'); }
  get recurrenceOcurrencesForm() { return this.eventForm.get('recurrenceOcurrencesForm'); }
  get customRepeatForm() { return this.eventForm.get('customRepeatForm'); }
  get customFrecuenceForm() { return this.eventForm.get('customFrecuenceForm'); }
  get addressLine1() { return this.eventForm.get('addressLine1'); }
  get addressLine2() { return this.eventForm.get('addressLine2'); }
  get city() { return this.eventForm.get('city'); }
  get state() { return this.eventForm.get('state'); }
  get zip() { return this.eventForm.get('zip'); }
  get phoneNumber() { return this.eventForm.get('phoneNumber'); }
  get fax() { return this.eventForm.get('fax'); }
  get notes() { return this.eventForm.get('notes'); }
  get notifyTeam() { return this.eventForm.get('notifyTeam'); }

  formatDayOfWeek(day: number) {
    switch(day) {
      case 0: return 'Sunday';
      case 1: return 'Monday';
      case 2: return 'Tuesday';
      case 3: return 'Wednesday';
      case 4: return 'Thursday';
      case 5: return 'Friday';
      case 6: return 'Saturday';
    }
  }

  formatMonth(month: number) {
    switch(month) {
      case 0: return 'January';
      case 1: return 'February';
      case 2: return 'March';
      case 3: return 'April';
      case 4: return 'May';
      case 5: return 'June';
      case 6: return 'July';
      case 7: return 'August';
      case 8: return 'September';
      case 9: return 'October';
      case 10: return 'November';
      case 11: return 'December';
    }
  }

  getGetOrdinal(n: number) {
    var s=["th","st","nd","rd"],
        v=n%100;
    return n+(s[(v-20)%10]||s[v]||s[0]);
 }

  doEventPost() {
    this.eventsService.doEventPost(this.event);
  }

  addMember() {
    if (!this.familyMembersSelected) {
      this.familyMembersSelected = [];
    }
    this.familyMembersSelected.push(this.familyMemberForm.value);
    this.isFamilyMemberFormValid = true;
  }

  deleteMember(member) {
    this.familyMembersSelected.splice(this.familyMembersSelected.indexOf(member), 1);
    this.familyMemberForm.setValue(null);
    if (this.familyMembersSelected.length === 0) {
      this.isFamilyMemberFormValid = false;
    }
  }

  addAttachment(event) {
    if (!this.attachments) {
      this.attachments = [];
    }
    let length = event.target.files.length;
    if (length > 0) {
      for (let i = 0; i < length; i ++) {
        this.progress = 0;
        this.attachments.push(event.target.files[i]);
        while (this.progress < 100) {
            this.progress ++;
        }
      }
    }
  }

  deleteFile(file) {
    console.log(this.attachments, file);
    this.attachments.splice(this.attachments.indexOf(file), 1);
    console.log(this.attachments, file);
    if (this.attachments.length === 0) {
      this.progress = 0;
    }
  }

  validateTime() {
    if (this.dpstart.value.equals(this.dpend) && this.startTime > this.endTime) {
      this.isValidTime = false;
    } else {
      this.isValidTime = true;
    }
    
  }

  showEnds() {
    return this.recurrence.value !== 'Doesnotrepeat';
  }

  showEndDate() {
    return this.recurrence.value !== 'Doesnotrepeat' && this.endsForm.value !== 'Never';
  }

  postEvent() {
    if (this.eventForm.status === 'VALID') {
      this.event.title = this.title.value;
      if (this.detail.value) {
        this.event.detail = this.detail.value;
      }
      this.event.type = this.type.value;
      this.event.familyMembers = this.familyMembersSelected.map((item) => item.id);
      if (this.leadForm.value) {
        this.event.lead = this.leadForm.value.id;
      }
      // start
      let hour = parseInt(this.startTimeForm.value.toString().substring(0, 2));
      let min = parseInt(this.startTimeForm.value.toString().substring(3, 5));
      const startDate = new Date(this.dpstart.value.year, this.dpstart.value.month - 1, this.dpstart.value.day, hour, min, 0);
      this.event.start = startDate.toISOString();
      // end
      hour = parseInt(this.endTimeForm.value.toString().substring(0, 2));
      min = parseInt(this.endTimeForm.value.toString().substring(3, 5));
      const endDate = new Date(this.dpend.value.year, this.dpend.value.month, this.dpend.value.day, hour, min, 0);
      this.event.end = endDate.toISOString();
      if (this.recurrence.value) {
        this.event.recurrence = this.recurrenceToRrule() ? this.recurrenceToRrule().toString() : null;
        this.event.recurrenceDescription = this.recurrenceToRrule() ? this.recurrenceToRrule().toText() : 'Does not repeat';
      }
      this.event.timezone = this.timezone.value;
      this.event.alert = this.alert.value;
      this.event.notifyTeam = this.notifyTeam.value;
      this.event.notes = this.notes.value;
      this.event.address.addressLine1 = this.addressLine1.value;
      this.event.address.addressLine2 = this.addressLine2.value;
      this.event.address.city = this.city.value;
      this.event.address.zipCode = this.zip.value;
      this.event.address.state = this.state.value;
      this.event.address.phoneNumber = this.phoneNumber.value;
      this.event.address.faxNumber = this.fax.value;
      let promise;
      if (this.attachments && this.attachments.length > 0) {
        this.event.attachments = [];
        promise = new Promise((resolve, reject) => {
          for(let i = 0; i < this.attachments.length; i++) {
            let attachment = new EventAttachment();
            this.getBase64(this.attachments[i]).subscribe((file: string) => {
              console.log(file);
              attachment.file = file;
              this.event.attachments.push(attachment);
              if (i+1 === this.attachments.length) {
                resolve();
              }
            }, (error) => {
              console.log(error);
              reject()
            });
          }
        })
        
      }
      if (!promise) {
        this.eventsService.doEventPost(this.event).subscribe((res: Event) => {
          console.log(event)});
          this.onEventPost.emit(true);
          this.dialogRef.close();
      } else {
        Promise.all([promise]).then(() => {
          this.eventsService.doEventPost(this.event).subscribe((res: Event) => {
            console.log(event)});
            this.onEventPost.emit(true);
            this.dialogRef.close();
        }).catch((error) => {
          this.onEventPost.emit(false);
          this.dialogRef.close();
        })
      }
      
    } else {
      alert("There are invalid fields");
    }
  }

  getBase64(file): Observable<string> {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return Observable.create((observer: Subscriber<string | ArrayBuffer>): void => {
      // if success
      reader.onload = ((ev: ProgressEvent): void => {
        observer.next(reader.result);
        observer.complete();
      })

      // if failed
      reader.onerror = (error: ProgressEvent): void => {
        observer.error(error);
      }
    });
  }
 

  recurrenceToRrule(): RRule {
    switch(this.recurrence.value) {
      case 'Doesnotrepeat': return this.doesNotRepeat();
      case 'Daily': return this.dailyToRrule();
      case 'WeeklyondayOfWeek': return this.weeklyondayOfWeekToRrule();
      case 'Monthlyonthefirst': return this.monthlyonthefirst();
      case 'Monthlyonthe': return this.monthlyonthe();
      case 'Annuallyonthe': return this.annuallyonthe();
      case 'EveryweekdayMondaytoFriday': return this.everyweekdayMondaytoFriday();
      case 'Custom': return this.custom();
    }
  }

  untilAndCount() {
    this.until = this.endsForm.value !== 'Never' && this.recurrenceEndDateForm.value ? 
      new Date(
        this.recurrenceEndDateForm.value.year,
        this.recurrenceEndDateForm.value.month,
        this.recurrenceEndDateForm.value.day) :
        null;
    this.count = this.recurrenceOcurrencesForm.value ? this.recurrenceOcurrencesForm.value : null;
  }

  doesNotRepeat(): RRule {
    return new RRule({
      freq: RRule.DAILY,
      dtstart: new Date(),
      count: 1
    });
  }
  
  dailyToRrule(): RRule {
    this.untilAndCount();
    let rule;
    if (!this.until && !this.count) {
      rule = new RRule({
        freq: RRule.DAILY,
        dtstart: new Date()
      });
    } else if (this.until && !this.count) {
      rule = new RRule({
        freq: RRule.DAILY,
        dtstart: new Date(),
        until: this.until
      });
    } else if (!this.until && this.count) {
      rule = new RRule({
        freq: RRule.DAILY,
        dtstart: new Date(),
        count: this.count
      });
    } else if (this.until && this.count) {
      rule = new RRule({
        freq: RRule.DAILY,
        dtstart: new Date(),
        until: this.until,
        count: this.count
      });
    }

    return rule;
  }

  weeklyondayOfWeekToRrule(): RRule {
    this.untilAndCount();
    let rule;
    if (!this.until && !this.count) {
      rule = new RRule({
        freq: RRule.WEEKLY,
        byweekday: this.date.getDay() -1,
        dtstart: new Date(),
      });
    } else if (this.until && !this.count) {
      rule = new RRule({
        freq: RRule.WEEKLY,
        byweekday: this.date.getDay() -1,
        dtstart: new Date(),
        until: this.until
      });
    } else if (!this.until && this.count) {
      rule = new RRule({
        freq: RRule.WEEKLY,
        byweekday: this.date.getDay() -1,
        dtstart: new Date(),
        count: this.count
      });
    } else if (this.until && this.count) {
      rule = new RRule({
        freq: RRule.WEEKLY,
        byweekday: this.date.getDay() -1,
        dtstart: new Date(),
        until: this.until,
        count: this.count
      });
    }
    return rule;
  }

  monthlyonthefirst(): RRule {
    this.untilAndCount();
    let rule;
    if (!this.until && !this.count) {
      rule = new RRule({
        freq: RRule.MONTHLY,
        byweekday: this.date.getDay() -1,
        bysetpos: 1,
        dtstart: new Date(),
      });
    } else if (this.until && !this.count) {
      rule = new RRule({
        freq: RRule.MONTHLY,
        byweekday: this.date.getDay() -1,
        bysetpos: 1,
        dtstart: new Date(),
        until: this.until
      });
    } else if (!this.until && this.count) {
      rule = new RRule({
        freq: RRule.MONTHLY,
        byweekday: this.date.getDay() -1,
        bysetpos: 1,
        dtstart: new Date(),
        count: this.count
      });
    } else if (this.until && this.count) {
      rule = new RRule({
        freq: RRule.MONTHLY,
        byweekday: this.date.getDay() -1,
        bysetpos: 1,
        dtstart: new Date(),
        until: this.until,
        count: this.count
      });
    }
    return rule;
  }

  monthlyonthe(): RRule {
    this.untilAndCount();
    let rule;
    if (!this.until && !this.count) {
      rule = new RRule({
        freq: RRule.MONTHLY,
        bysetpos: 1,
        dtstart: new Date(),
      });
    } else if (this.until && !this.count) {
      rule = new RRule({
        freq: RRule.MONTHLY,
        bysetpos: 1,
        dtstart: new Date(),
        until: this.until
      });
    } else if (!this.until && this.count) {
      rule = new RRule({
        freq: RRule.MONTHLY,
        bysetpos: 1,
        dtstart: new Date(),
        count: this.count
      });
    } else if (this.until && this.count) {
      rule = new RRule({
        freq: RRule.MONTHLY,
        bysetpos: 1,
        dtstart: new Date(),
        until: this.until,
        count: this.count
      });
    }
    return rule;
  }

  annuallyonthe(): RRule {
    this.untilAndCount();
    let rule;
    if (!this.until && !this.count) {
      rule = new RRule({
        freq: RRule.YEARLY,
        bysetpos: 1,
        dtstart: new Date(),
      });
    } else if (this.until && !this.count) {
      rule = new RRule({
        freq: RRule.YEARLY,
        bysetpos: 1,
        dtstart: new Date(),
        until: this.until
      });
    } else if (!this.until && this.count) {
      rule = new RRule({
        freq: RRule.YEARLY,
        bysetpos: 1,
        dtstart: new Date(),
        count: this.count
      });
    } else if (this.until && this.count) {
      rule = new RRule({
        freq: RRule.YEARLY,
        bysetpos: 1,
        dtstart: new Date(),
        until: this.until,
        count: this.count
      });
    }
    return rule;
  }

  everyweekdayMondaytoFriday(): RRule {
    this.untilAndCount();
    let rule;
    if (!this.until && !this.count) {
      rule = new RRule({
        freq: RRule.MONTHLY,
        byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
        dtstart: new Date(),
      });
    } else if (this.until && !this.count) {
      rule = new RRule({
        freq: RRule.MONTHLY,
        byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
        dtstart: new Date(),
        until: this.until
      });
    } else if (!this.until && this.count) {
      rule = new RRule({
        freq: RRule.MONTHLY,
        byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
        dtstart: new Date(),
        count: this.count
      });
    } else if (this.until && this.count) {
      rule = new RRule({
        freq: RRule.MONTHLY,
        byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
        dtstart: new Date(),
        until: this.until,
        count: this.count
      });
    }
    return rule;
  }

  custom(): RRule {
    let byweekday = [];
    if (this.activeMon) { byweekday.push(RRule.MO) }
    if (this.activeTue) { byweekday.push(RRule.TU) }
    if (this.activeWed) { byweekday.push(RRule.WE) }
    if (this.activeTur) { byweekday.push(RRule.TH) }
    if (this.activeFri) { byweekday.push(RRule.FR) }
    if (this.activeSat) { byweekday.push(RRule.SA) }
    if (this.activeSun) { byweekday.push(RRule.SU) }
    let freq;
    switch(this.customFrecuenceForm.value) {
      case "0": freq = RRule.DAILY; break;
      case "0": freq = RRule.WEEKLY; break;
      case "0": freq = RRule.MONTHLY; break;
      case "0": freq = RRule.YEARLY; break;
      default: freq = null;
    }
    let count = parseInt(this.customRepeatForm.value);
    if (byweekday.length > 0) {
      return new RRule({
        freq: freq,
        byweekday: byweekday,
        dtstart: new Date(),
        count: count
      })
    } else {
      return new RRule({
        freq: freq,
        dtstart: new Date(),
        count: count
      })
    }  
  }
}
