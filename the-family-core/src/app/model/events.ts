import { Address } from './contact';
import { FamilyUser } from './family';
import { FormGroup } from '@angular/forms';

export class EventAttachment {
    id: number;
    file: File;
    thumbnail: string;
}

export class Event {
    id: number;
    title: string;
    detail: string;
    type: number; // 0, 1, 2
    familyMembers: number[];
    lead: number;
    start: string;
    end: string;
    recurrence: string;
    recurrenceDescription: string;
    timezone: string;
    alert: number; // 0, 1, 2, 3
    notifyTeam:	boolean;
    notes: string;
    address: Address;
    attachments: EventAttachment[];

    constructor(form: FormGroup) {
        this.title = form.get('title').value;
        if (form.get('detail').value) {
          this.detail = form.get('detail').value
        }
        this.type = form.get('type').value.id;
        if (form.get('leadForm').value) {
            this.lead = form.get('leadForm').value.id;
        }
        // start
        let hour = parseInt(form.get('startTimeForm').value.toString().substring(0, 2));
        let min = parseInt(form.get('startTimeForm').value.toString().substring(3, 5));
        const startDate = new Date(form.get('dpstart').value.year, form.get('dpstart').value.month - 1, form.get('dpstart').value.day, hour, min, 0);
        this.start = startDate.toISOString();
        // end
        hour = parseInt(form.get('endTimeForm').value.toString().substring(0, 2));
        min = parseInt(form.get('endTimeForm').value.toString().substring(3, 5));
        const endDate = new Date(form.get('dpend').value.year, form.get('dpend').value.month, form.get('dpend').value.day, hour, min, 0);
        this.end = endDate.toISOString();
        this.timezone = form.get('timezone').value;
        if (form.get('alert').value){
            this.alert = form.get('alert').value;
        }
        this.notifyTeam = form.get('notifyTeam').value;
        if (form.get('notes').value) {
            this.notes = form.get('notes').value;
        }
        if (form.get('addressLine1').value) {
            if (!this.address) {
                this.address = new Address();
            }
            this.address.addressLine1 = form.get('addressLine1').value;
        }
        if (form.get('addressLine2').value) {
            if (!this.address) {
                this.address = new Address();
            }
            this.address.addressLine2 = form.get('addressLine2').value;
        }
        if (form.get('city').value) {
            if (!this.address) {
                this.address = new Address();
            }
            this.address.city = form.get('city').value;
        }
        if (form.get('zip').value) {
            if (!this.address) {
                this.address = new Address();
            }
            this.address.zipCode = form.get('zip').value;
        }
        if (form.get('state').value) {
            if (!this.address) {
                this.address = new Address();
            }
            this.address.state = form.get('state').value;
        }
        if (form.get('phoneNumber').value) {
            if (!this.address) {
                this.address = new Address();
            }
            this.address.phoneNumber = form.get('phoneNumber').value;
        }
        if (form.get('fax').value) {
            if (!this.address) {
                this.address = new Address();
            }
            this.address.faxNumber = form.get('fax').value;
        }
    }
}

export class EventResponse {
    count: number;
    next: any;
    previous: any;
    results: Event[];

    constructor(
        count: number,
        next: any,
        previous: any,
        results: Event[]
    ) {
        this.count = count;
        this.next = next;
        this.previous = previous;
        this.results = results;
    }
}

