import { FormGroup } from '@angular/forms';

export class Address {
    id: number;
    addressLine1: string;
    addressLine2: string;
    city: string;
    zipCode: string;
    state: string;
    phoneNumber: string;
    faxNumber: string;
}

export class Contact {
    id: number;
    type: number; // Enum: 0, 1, 2, 3
    name: string;
    detail: string;
    email: string;
    phoneNumber: string;
    avatar: File;
    familyMembers: number[];
    notifyTeam: boolean;
    notes: string;
    address: Address;

    constructor(form: FormGroup) {
        this.name = form.get('title').value;
        if (form.get('detail').value) {
          this.detail = form.get('detail').value
        }
        this.type = form.get('type').value.id;
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
            this.phoneNumber = form.get('phoneNumber').value;
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

export class ContactResponse {
    count: number;
    next: string;
    previous: string;
    results: Contact[];

    constructor(
        count: number,
        next: string,
        previous: string,
        results: Contact[]) {
            this.count = count;
            this.next = next;
            this.previous = previous;
            this.results = results;
        }
}

export class PostContactResponse {
    id: number;
    type: number;
    name: string;
    detail: string;
    email: string;
    phoneNumber: string;
    avatar: string;
    familyMembers: number[];
    notifyTeam: boolean;
    notes: string;
    address: Address;

    constructor(
        id: number,
        type: number,
        name: string,
        detail: string,
        email: string,
        phoneNumber: string,
        avatar: string,
        familyMembers: number[],
        notifyTeam: boolean,
        notes: string,
        address: Address
    ) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.detail = detail;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.avatar = avatar;
        this.familyMembers = familyMembers;
        this.notifyTeam = notifyTeam;
        this.notes = notes;
        this.address = address;
    }
}