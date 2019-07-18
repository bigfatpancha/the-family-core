import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';
import { Timezone } from 'src/app/model/data';
import { EventsService } from 'src/app/services/events/events.service';
import { Event, EventAttachment } from '../../model/events';
import { UsersService } from 'src/app/services/users/users.service';
import { FamilyUser, FamilyUserListResponse } from 'src/app/model/family';
import { Address, Contact } from 'src/app/model/contact';
import { Document } from 'src/app/model/documents';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RRule } from 'rrule'
import { Observable, Subscriber } from 'rxjs';
import { MatDialogRef } from '@angular/material';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { ContactsService } from 'src/app/services/contacts/contacts.service';

export class Type {
  id: number;
  type: number; // event = 0, document = 1, contact = 2
  description: string;
  constructor(id: number, type: number, description: string) {
    this.id = id;
    this.type = type;
    this.description = description;
  }
}

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
    private documentsService: DocumentsService,
    private contactsService: ContactsService,
    public dialogRef: MatDialogRef<UploadComponent>
  ) { }

  eventForm: FormGroup;

  types: Type[] = [
    new Type(0, 0, 'General Appointment'),
    new Type(1, 0, 'School Task'),
    new Type(2, 0, 'Medical Appointment'),

    new Type(0, 1, 'General Document'),
    new Type(1, 1, 'Medical Record'),
    new Type(2, 1, 'Rx'),
    new Type(3, 1, 'Legal Document'),

    new Type(0, 2, 'General Contact'),
    new Type(1, 2, 'Doctor'),
    new Type(2, 2, 'Teacher'),
    new Type(3, 2, 'Classmate'),
    new Type(4, 2, 'School Location')
  ]

  saveClicked = false;
  ariaValuenow = 0;
  timezones: Timezone[];
  isFamilyMemberFormValid = false;
  familyMembersSelected: FamilyUser[];
  familyMembers: FamilyUser[];

  lead: FamilyUser;
  leadSelected: FamilyUser[];

  progress: number;
  attachments: EventAttachment[];

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
    });
    this.date = new Date();
    this.startDate = new NgbDate(this.date.getFullYear(), this.date.getMonth() + 1, this.date.getDate());
    this.dayOfWeek = this.formatDayOfWeek(this.date.getDay());
    this.dayOfMonth = this.date.getDate().toString() + this.getGetOrdinal(this.date.getDate());
    this.dayOfYear = this.formatMonth(this.date.getMonth()) + ' ' + this.dayOfMonth;
    this.progress = 0;

    this.eventForm = new FormGroup({
      'title': new FormControl(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30)
      ]),
      'detail': new FormControl(null, [Validators.maxLength(30)]),
      'type': new FormControl(this.types[0], [Validators. required]),
      'familyMemberForm': new FormControl(null),
      'leadForm': new FormControl(null),
      'dpstart': new FormControl(this.startDate),
      'startTimeForm': new FormControl(this.startTime),
      'dpend': new FormControl(this.endDate),
      'endTimeForm': new FormControl(this.endTime),
      'timezone': new FormControl(null),
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
      'notifyTeam': new FormControl(false),
      'email': new FormControl(null)
    });


    this.eventForm.get('type').valueChanges.subscribe((type: Type) => {
      if (type.type === 0) { // for setting validations
        this.eventForm.get('email').clearValidators();
        this.eventForm.get('email').updateValueAndValidity();
        this.eventForm.get('dpstart').setValidators(Validators.required);
        this.eventForm.get('dpstart').updateValueAndValidity();
        this.eventForm.get('startTimeForm').setValidators(Validators.required);
        this.eventForm.get('startTimeForm').updateValueAndValidity();
        this.eventForm.get('dpend').setValidators(Validators.required);
        this.eventForm.get('dpend').updateValueAndValidity();
        this.eventForm.get('endTimeForm').setValidators(Validators.required);
        this.eventForm.get('endTimeForm').updateValueAndValidity();
        this.eventForm.get('timezone').setValidators(Validators.required);
        this.eventForm.get('timezone').updateValueAndValidity();
        this.eventForm.get('detail').clearValidators();
        this.eventForm.get('detail').updateValueAndValidity();
      } else if (type.type === 1) {
        this.eventForm.get('email').clearValidators();
        this.eventForm.get('email').updateValueAndValidity();
        this.eventForm.get('dpstart').clearValidators();
        this.eventForm.get('dpstart').updateValueAndValidity();
        this.eventForm.get('startTimeForm').clearValidators();
        this.eventForm.get('startTimeForm').updateValueAndValidity();
        this.eventForm.get('dpend').clearValidators();
        this.eventForm.get('dpend').updateValueAndValidity();
        this.eventForm.get('endTimeForm').clearValidators();
        this.eventForm.get('endTimeForm').updateValueAndValidity();
        this.eventForm.get('timezone').clearValidators();
        this.eventForm.get('timezone').updateValueAndValidity();
        this.eventForm.get('detail').setValidators([Validators.required]);
        this.eventForm.get('detail').updateValueAndValidity();
      } else if (type.type === 2) {
        this.eventForm.get('detail').clearValidators();
        this.eventForm.get('detail').updateValueAndValidity();
        this.eventForm.get('email').setValidators([Validators.required, Validators.maxLength(254)]);
        this.eventForm.get('email').updateValueAndValidity();
        this.eventForm.get('dpstart').clearValidators();
        this.eventForm.get('dpstart').updateValueAndValidity();
        this.eventForm.get('startTimeForm').clearValidators();
        this.eventForm.get('startTimeForm').updateValueAndValidity();
        this.eventForm.get('dpend').clearValidators();
        this.eventForm.get('dpend').updateValueAndValidity();
        this.eventForm.get('endTimeForm').clearValidators();
        this.eventForm.get('endTimeForm').updateValueAndValidity();
        this.eventForm.get('timezone').clearValidators();
        this.eventForm.get('timezone').updateValueAndValidity();
      }
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
  get email() { return this.eventForm.get('email'); }

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
    const length = event.target.files.length;
    if (length > 0) {
      for (let i = 0; i < length; i ++) {
        this.progress = 0;
        const attachment = new EventAttachment();
        attachment.file = event.target.files[i];
        this.attachments.push(attachment);
        while (this.progress < 100) {
            this.progress ++;
        }
      }
    }
  }

  deleteFile(file) {
    this.attachments.splice(this.attachments.indexOf(file), 1);
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
      if (this.type.value.type === 0) {
        const event = new Event(this.eventForm);
        event.familyMembers = this.familyMembersSelected.map((item) => item.id);
        if (this.recurrence.value) {
          event.recurrence = this.recurrenceToRrule() ? this.recurrenceToRrule().toString() : null;
        }
        if (this.attachments && this.attachments.length > 0) {
          event.attachments = this.attachments;
        }
        this.eventsService.doEventPost(event).subscribe((res: Event) => {
          this.onEventPost.emit(true);
          this.dialogRef.close();
          console.log(res);
        }, (err: Error) => {
          alert('Something went wrong, please try again ' + err.name);
        });
      } else if (this.type.value.type === 1) {
        const document = new Document(this.eventForm);
        document.familyMembers = this.familyMembersSelected.map((item) => item.id);
        if (this.attachments && this.attachments.length > 0) {
          document.attachments = this.attachments;
        }
        this.documentsService.doDocumentPost(document).subscribe((res: Document) => {
          this.onEventPost.emit(true);
          this.dialogRef.close();
          console.log(res);
        }, (err: Error) => {
          alert('Something went wrong, please try again ' + err.name);
        });
      } else if (this.type.value.type === 2) {
        const contact = new Contact(this.eventForm);
        contact.familyMembers = this.familyMembersSelected.map((item) => item.id);
        if (this.attachments && this.attachments.length > 0) {
          contact.avatar = this.attachments[0].file;
        }
        this.contactsService.doContactsPost(contact).subscribe((res: Contact) => {
          this.onEventPost.emit(true);
          this.dialogRef.close();
          console.log(res);
        }, (err: Error) => {
          alert('Something went wrong, please try again ' + err.name);
        });
      }
    } else {
      this.eventForm.markAllAsTouched();
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
