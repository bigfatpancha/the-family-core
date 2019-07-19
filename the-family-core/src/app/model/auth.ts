import { Address } from './contact';

export class LoginRequest {
    username: string;
    email: string;
    password: string;
}

export class SendVerifyEmail {
    email: string;
}

export class ReferredBy {
    name: string;
    driversLicenseState: string;
    driversLicenseNumber: string;
    placeOfBirth: string;
    passportNumber: string;
    socialSecurityNumber: string;
    countryOfCitizenship: string;
    agencyForBackgroundCheck: string;
    colorCode: string;
}

export class User {
    id: number;
    role: number;
    username: string;
    nickname: string;
    avatar: File;
    familyId: number;
    email: string;
    colorCode: string;
    sendbirdId: string;
    coordinate: string;
    password1: string;
    password2: string;
    firstName: string;
    middleName: string;
    lastName: string;
    gender: number;
    mobileNumber: string;
    birthDate: string;
    height: string;
    weight: string;
    hairColor: string;
    eyeColor: string;
    bloodType: string;
    countryOfCitizenship: string;
    passportNumber: string;
    socialSecurityNumber: string;
    schoolState: string;
    school: string;
    grade: string;
    topSize: string;
    bottomsSize: string;
    shoeSize: string;
    braSize: string;
    shirtSize: string;
    pantsSize: string;
    allergies: string[];
    favorites: string[];
    dislikes: string[];
    wishlist: string[];
    adminNotes: string;
    address: Address;
    referredBy: ReferredBy;
    relationships: number[];
    stars: number;
}

export class LoginResponse {
    key: string;
    user: User;

    constructor(key: string, user: User) {
        this.key = key;
        this.user = user;
    }
}

export class RegistrationRequest {
    username: string;
    nickname: string;
    email: string;
    password1: string;
    password2: string;
    firstName: string;
    middleName: string;
    lastName: string;
    mobileNumber: string;
    birthDate: string;

    constructor()
    constructor(
        username?: string,
        nickname?: string,
        email?: string,
        password1?: string,
        password2?: string,
        firstName?: string,
        middleName?: string,
        lastName?: string,
        mobileNumber?: string,
        birthDate?: string
    ) {
        this.username = username;
        this.nickname = nickname;
        this.email = email;
        this.password1 = password1;
        this.password2 = password2;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.mobileNumber = mobileNumber;
        this.birthDate = birthDate;
    }
}

export class RegistrationResponse {
    key: string;
    username: string;
    nickname: string;
    email: string;
    password1: string;
    password2: string;
    firstName: string;
    middleName: string;
    lastName: string;
    mobileNumber: string;
    birthDate: string;
    detail: string;
    code: number;
}
