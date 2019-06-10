export class Address {
    id: number;
    addressLine1: string;
    addressLine2: string;
    city: string;
    zipCode: string;
    state: string;

    constructor(id: number,
        addressLine1: string,
        addressLine2: string,
        city: string,
        zipCode: string,
        state: string) {
            this.id = id;
            this.addressLine1 = addressLine1;
            this.addressLine2 = addressLine2;
            this.city = city;
            this.zipCode = zipCode;
            this.state = state;
    }
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