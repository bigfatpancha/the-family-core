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
    avatar: string;
    familyMembers: number[];
    notifyTeam: boolean;
    notes: string;
    address: Address;

    constructor(id: number,
        type: number,
        name: string,
        detail: string,
        email: string,
        phoneNumber: string,
        avatar: string,
        familyMembers: number[],
        notifyTeam: boolean,
        notes: string,
        address: Address) {
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