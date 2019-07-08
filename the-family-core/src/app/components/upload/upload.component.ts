import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private eventsService: EventsService,
    private userService: UsersService
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

  ngOnInit() {
    this.dataService.doTimezoneGet()
    .subscribe((data: Timezone[]) => {
      this.timezones = data;
    });
    this.userService.doGetUsersList()
    .subscribe((res: FamilyUserListResponse) => {
      this.familyMembers = res.results;
    })
    let date = new Date();
    this.startDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
    this.dayOfWeek = this.formatDayOfWeek(date.getDay());
    this.dayOfMonth = date.getDate().toString() + this.getGetOrdinal(date.getDate());
    this.dayOfYear = this.formatMonth(date.getMonth()) + ' ' + this.dayOfMonth;
    this.event.address = new Address();
    this.progress = 0;
    this.eventForm = new FormGroup({
      'title': new FormControl('Title', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30)
      ]),
      'detail': new FormControl('Detail', [Validators.maxLength(30)]),
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
      'recurrenceOcurrencesForm': new FormControl('Ocurrences'),
      'customRepeatForm': new FormControl(1),
      'customFrecuenceForm': new FormControl('Day'),
      'addressLine1': new FormControl('Address Line 1', [Validators.maxLength(128)]),
      'addressLine2': new FormControl('Address Line 2', [Validators.maxLength(128)]),
      'city': new FormControl('City', [Validators.maxLength(50)]),
      'state': new FormControl('state'),
      'zip': new FormControl('Zip Code', [Validators.maxLength(50)]),
      'phoneNumber': new FormControl('Phone Number', [Validators.maxLength(128)]),
      'fax': new FormControl('Fax Number', [Validators.maxLength(128)]),
      'notes': new FormControl('notes'),
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
    console.log('event.target.files.length', event.target.files);
    let length = event.target.files.length;
    if (length > 0) {
      for (let i = 0; i < length; i ++) {
        this.attachments.push(event.target.files[i]);
        while (this.progress < 100) {
            this.progress ++;
        }
      }
    }
    console.log(this.attachments);
  }

  deleteFile(file) {
    this.attachments.splice(this.attachments.indexOf(file), 1);
    if (this.attachments.length === 0) {
      this.progress = 0;
    }
  }

  validateTime() {
    console.log('validateTime');
    if (this.dpstart.value.equals(this.dpend) && this.startTime > this.endTime) {
      console.log('false');
      this.isValidTime = false;
    } else {
      console.log('true');
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
      this.event.detail = this.detail.value;
      this.event.type = this.type.value;
      this.event.familyMembers = this.familyMembersSelected.map((item) => item.id);
      this.event.lead = this.leadForm.value.id;
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
      this.event.recurrence = this.recurrence.value;
      if (this.event.recurrence !== 'Does not repeat') {
        this.event.recurrenceDescription = this.recurrenceDescriptionJson();
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
      
      this.event.attachments = this.attachments.map((file) => {
        let attachment = new EventAttachment();
        attachment.file = file.file;
        return attachment;
      });
      
      console.log(this.event);
    } else {
      alert("There are invalid fields");
    }
  }

  recurrenceDescriptionJson() {
    return '{' +
              'ends: ' + this.endsForm.value + ',' +
              'recurrenceEndDate: ' + this.recurrenceEndDateForm.value + ',' +
              'recurrenceOcurrences: ' + this.recurrenceOcurrencesForm.value + ',' +
              'customRepeat: ' + this.customRepeatForm.value + ',' +
              'customFrecuence: ' + this.customFrecuenceForm.value +
            '}'
  }

}
