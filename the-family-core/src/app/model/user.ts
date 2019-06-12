export class Address {
    id: number;
    addressLine1: string;
    addressLine2: string;
    city: string;
    zipCode: string;
    state: string; // enum todos los estados
    phoneNumber: string;
    faxNumber: string;

    constructor(id: number,
        addressLine1: string,
        addressLine2: string,
        city: string,
        zipCode: string,
        state: string,
        phoneNumber: string,
        faxNumber: string) {
            this.id = id;
            this.addressLine1 = addressLine1;
            this.addressLine2 = addressLine2;
            this.city = city;
            this.zipCode = zipCode;
            this.state = state;
            this.phoneNumber = phoneNumber;
            this.faxNumber = faxNumber;
    }
}

export class User {
    id: number;
    username: string;
    avatar: string;
    firstName: string;
    lastName: string;
    coordinate: string;
    sendbirdId: string;
    email: string;
    role: number; // enum: 0, 1, 2, 3, 4
    middleName: string;
    mobileNumber: string;
    birthDate: string;
    favorites: string[];
    dislikes: string[];
    wishlist: string[];
    address: Address;

    constructor(id: number,
        username: string,
        avatar: string,
        firstName: string,
        lastName: string,
        coordinate: string,
        sendbirdId: string,
        email: string,
        role: number,
        middleName: string,
        birthDate: string,
        favorites: string[],
        dislikes: string[],
        wishList: string[],
        address: Address) {
            this.id = id;
            this.username = username;
            this.avatar = avatar;
            this.firstName = firstName;
            this.lastName = lastName;
            this.coordinate = coordinate;
            this.sendbirdId = sendbirdId;
            this.email = email;
            this.role = role;
            this.middleName = middleName;
            this.birthDate = birthDate;
            this.favorites = favorites;
            this.dislikes = dislikes;
            this.wishlist = wishList;
            this.address = address;
    }
}