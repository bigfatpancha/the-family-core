import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';
import { Timezone } from 'src/app/model/data';
import { EventsService } from 'src/app/services/events/events.service';
import { Event, EventAttachment } from '../../model/events';
import { UsersService } from 'src/app/services/users/users.service';
import { FamilyUser } from 'src/app/model/family';
import { Contact } from 'src/app/model/contact';
import { Document } from 'src/app/model/documents';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RRule } from 'rrule'
import { Observable, Subscriber } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { ContactsService } from 'src/app/services/contacts/contacts.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GenericError } from 'src/app/model/error';

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
  selector: 'app-edit-upload',
  templateUrl: './edit-upload.component.html',
  styleUrls: ['./edit-upload.component.scss']
})
export class EditUploadComponent implements OnInit {
  @Output() onEventPut = new EventEmitter<any>();

  constructor(
    private dataService: DataService,
    private eventsService: EventsService,
    private userService: UsersService,
    private documentsService: DocumentsService,
    private contactsService: ContactsService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<EditUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
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
  isFamilyMemberFormValid = true;
  familyMembersSelected: FamilyUser[];
  familyMembers: FamilyUser[];

  lead: FamilyUser;
  leadSelected: FamilyUser[];

  progress: number;
  attachments: EventAttachment[];

  startDate: NgbDate;
  startTime: any;
  endDate: NgbDate;
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
    this.familyMembers = this.userService.users;
    if (this.data.data.familyMembers) {
      this.familyMembersSelected = [];
      this.data.data.familyMembers.forEach((id: number) => {
        this.userService.users.forEach((user: FamilyUser) => {
          if (id === user.id) {
            this.familyMembersSelected.push(user);
          }
        });
      });
    }
    this.date = new Date();
    this.startDate = new NgbDate(this.date.getFullYear(), this.date.getMonth() + 1, this.date.getDate());
    this.dayOfWeek = this.formatDayOfWeek(this.date.getDay());
    this.dayOfMonth = this.getGetOrdinal(this.date.getDate());
    this.dayOfYear = this.formatMonth(this.date.getMonth()) + ' ' + this.dayOfMonth;
    this.progress = 0;
    this.createFromEvent();
    this.familyMemberForm.markAsTouched();
    if (this.data.data.attachments) {
      this.attachments = [];
      this.data.data.attachments.forEach((attachment) => this.attachments.push(attachment));
    }
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

  createFromEvent() {
    const event = this.data.data;
    const type = this.types.find((type: Type) => type.type === this.data.type && type.id === event.type)
    let start;
    let end;
    if (event.start) {
      const startDate = new Date(event.start);
      start = new NgbDate(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
      this.startTime = startDate.getHours().toString() + ':' + startDate.getMinutes().toString();
    }
    if (event.end) {
      const endDate = new Date(event.end);
      end = new NgbDate(endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate());
      this.endTime = endDate.getHours().toString() + ':' + endDate.getMinutes().toString();
    }
    this.eventForm = new FormGroup({
      'title': new FormControl(event.title ? event.title : event.name, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30)
      ]),
      'detail': new FormControl(event.detail && event.detail !== 'null' ? event.detail : event.description, [Validators.maxLength(30)]),
      'type': new FormControl(type, [Validators. required]),
      'familyMemberForm': new FormControl(null),
      'leadForm': new FormControl(event.lead ? event.lead : null),
      'dpstart': new FormControl(event.start ? start : this.startDate),
      'startTimeForm': new FormControl(this.startTime),
      'dpend': new FormControl(event.end ? end : this.endDate),
      'endTimeForm': new FormControl(this.endTime),
      'timezone': new FormControl(event.timezone ? event.timezone.name : null),
      'alert': new FormControl(event.alert),
      'recurrence': new FormControl('Doesnotrepeat'),
      'endsForm': new FormControl('Never'),
      'recurrenceEndDateForm': new FormControl(this.startDate),
      'recurrenceOcurrencesForm': new FormControl(null),
      'customRepeatForm': new FormControl(1),
      'customFrecuenceForm': new FormControl('Day'),
      'addressLine1': new FormControl(event.address && event.address.addressLine1 ? event.address.addressLine1 : null, [Validators.maxLength(128)]),
      'addressLine2': new FormControl(event.address && event.address.addressLine2 ? event.address.addressLine2 : null, [Validators.maxLength(128)]),
      'city': new FormControl(event.address && event.address.city ? event.address.city : null, [Validators.maxLength(50)]),
      'state': new FormControl(event.address && event.address.state ? event.address.state : null),
      'zip': new FormControl(event.address && event.address.zipCode ? event.address.zipCode : null, [Validators.maxLength(50)]),
      'phoneNumber': new FormControl(event.address && event.address.phoneNumber ? event.address.phoneNumber : null, [Validators.maxLength(128)]),
      'fax': new FormControl(event.address && event.address.faxNumber ? event.address.faxNumber : null, [Validators.maxLength(128)]),
      'notes': new FormControl(event.notes),
      'notifyTeam': new FormControl(event.notifyTeam),
      'email': new FormControl(event.email ? event.email : null)
    }, this.validateTime);
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

  validateTime(group: FormGroup) {
    if (group && group.controls && group.controls.dpstart.value && group.controls.dpend.value && group.controls.startTimeForm.value && group.controls.endTimeForm.value) {
      // start
      let hour = parseInt(group.controls.startTimeForm.value.toString().substring(0, 2));
      let min = parseInt(group.controls.startTimeForm.value.toString().substring(3, 5));
      const startDate = new Date(group.controls.dpstart.value.year, group.controls.dpstart.value.month - 1, group.controls.dpstart.value.day, hour, min, 0);
      // end
      hour = parseInt(group.controls.endTimeForm.value.toString().substring(0, 2));
      min = parseInt(group.controls.endTimeForm.value.toString().substring(3, 5));
      const endDate = new Date(group.controls.dpend.value.year, group.controls.dpend.value.month - 1, group.controls.dpend.value.day, hour, min, 0);

      return startDate > endDate ? { notValidTime: true } : null;
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
      this.spinner.show();
      if (this.type.value.type === 0) {
        const event = new Event(this.eventForm);
        if (this.familyMemberForm.dirty) {
          event.familyMembers = this.familyMembersSelected.map((item) => item.id);
        } else {
          event.familyMembers = this.data.data.familyMembers;
        }      
        if (this.isRecurrenceEdited()) {
          event.recurrence = this.recurrenceToRrule() ? this.recurrenceToRrule().toString() : null;
        }
        if (this.attachments && this.attachments.length > 0) {
          event.attachments = this.attachments;
        }
        this.eventsService.doEventIdPut(this.data.data.id, event).subscribe((res: Event) => {
          this.spinner.hide();
          this.onEventPut.emit(res);
          this.dialogRef.close();
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
      } else if (this.type.value.type === 1) {
        const document = new Document(this.eventForm);
        if (this.familyMemberForm.dirty) {
          document.familyMembers = this.familyMembersSelected.map((item) => item.id);
        } else {
          document.familyMembers = this.data.data.familyMembers;
        }
        if (this.attachments && this.attachments.length > 0) {
          document.attachments = this.attachments;
        }
        this.documentsService.doDocumentIdPut(this.data.data.id, document, this.data.userId).subscribe((res: Document) => {
          this.spinner.hide();
          this.onEventPut.emit(res);
          this.dialogRef.close();
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
      } else if (this.type.value.type === 2) {
        const contact = new Contact(this.eventForm);
        if (this.familyMemberForm.dirty) {
          contact.familyMembers = this.familyMembersSelected.map((item) => item.id);
        } else {
          contact.familyMembers = this.data.data.familyMembers;
        }
        if (this.attachments && this.attachments.length > 0) {
          contact.avatar = this.attachments[0].file;
        }
        this.contactsService.doContactIdPut(this.data.data.id, contact, this.data.userId).subscribe((res: Contact) => {
          this.spinner.hide();
          this.onEventPut.emit(res);
          this.dialogRef.close();
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
    } else {
      this.eventForm.markAllAsTouched();
    }
  }

  isRecurrenceEdited(): boolean {
    return (this.recurrence.dirty || this.endsForm.dirty || this.recurrenceEndDateForm.dirty || this.recurrenceOcurrencesForm.dirty ||
      this.customRepeatForm.dirty || this.customFrecuenceForm.dirty);
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

  delete() {
    if (this.data.type === 0) {
      this.eventsService.doEventIdDelete(this.data.data.id)
      .subscribe(() => {
        this.dialogRef.close();
        this.onEventPut.emit(this.data.data);
      });
    } else if (this.data.type === 1) {
      this.documentsService.doDocumentIdDelete(this.data.data.id, this.userService.user.id)
      .subscribe(() => {
        this.dialogRef.close();
        this.onEventPut.emit(this.data.data);
      });
    } else if (this.data.type === 2) {
      this.contactsService.doContactIdDelete(this.data.data.id, this.userService.user.id)
      .subscribe(() => {
        this.dialogRef.close();
        this.onEventPut.emit(this.data.data);
      });
    }
  }
}
