import { Address } from './contact';

export interface LoginRequest {
    username: string;
    email: string;
    password: string;
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

    constructor()
    constructor(
        name?: string,
        driversLicenseState?: string,
        driversLicenseNumber?: string,
        placeOfBirth?: string,
        passportNumber?: string,
        socialSecurityNumber?: string,
        countryOfCitizenship?: string,
        agencyForBackgroundCheck?: string
    ) {
        this.name = name;
        this.driversLicenseState = driversLicenseState;
        this.driversLicenseNumber = driversLicenseNumber;
        this.placeOfBirth = placeOfBirth;
        this.passportNumber = passportNumber;
        this.socialSecurityNumber = socialSecurityNumber;
        this.countryOfCitizenship = countryOfCitizenship;
        this.agencyForBackgroundCheck = agencyForBackgroundCheck;
    }
}

export class User {
    id: number;
    role: number;
    username: string;
    nickname: string;
    avatar: string;
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

    constructor();
    constructor(
        id?: number,
        role?: number,
        username?: string,
        nickname?: string,
        avatar?: string,
        familyId?: number,
        email?: string,
        coordinate?: string,
        password1?: string,
        password2?: string,
        colorCode?: string,
        sendbirdId?: string,
        firstName?: string,
        middleName?: string,
        lastName?: string,
        gender?: number,
        mobileNumber?: string,
        birthDate?: string,
        height?: string,
        weight?: string,
        hairColor?: string,
        eyeColor?: string,
        bloodType?: string,
        countryOfCitizenship?: string,
        passportNumber?: string,
        socialSecurityNumber?: string,
        schoolState?: string,
        school?: string,
        grade?: string,
        topSize?: string,
        bottomsSize?: string,
        shoeSize?: string,
        braSize?: string,
        shirtSize?: string,
        pantsSize?: string,
        allergies?: string[],
        favorites?: string[],
        dislikes?: string[],
        wishlist?: string[],
        adminNotes?: string,
        address?: Address,
        referredBy?: ReferredBy,
        relationships?: number[]) {
            this.id = id;
            this.role = role;
            this.username = username;
            this.nickname = nickname;
            this.avatar = avatar;
            this.familyId = familyId;
            this.email = email;
            this.coordinate = coordinate;
            this.password1 = password1;
            this.password2 = password2;
            this.colorCode = colorCode;
            this.sendbirdId = sendbirdId;
            this.firstName = firstName;
            this.middleName = middleName;
            this.lastName = lastName;
            this.gender = gender;
            this.mobileNumber = mobileNumber;
            this.birthDate = birthDate;
            this.height = height;
            this.weight = weight;
            this.hairColor = hairColor;
            this.eyeColor = eyeColor;
            this.bloodType = bloodType;
            this.countryOfCitizenship = countryOfCitizenship;
            this.passportNumber = passportNumber;
            this.socialSecurityNumber = socialSecurityNumber;
            this.schoolState = schoolState;
            this.school = school;
            this.grade = grade;
            this.topSize = topSize;
            this.bottomsSize = bottomsSize;
            this.shoeSize = shoeSize;
            this.braSize = braSize;
            this.shirtSize = shirtSize;
            this.pantsSize = pantsSize;
            this.allergies = allergies;
            this.favorites = favorites;
            this.dislikes = dislikes;
            this.wishlist = wishlist;
            this.adminNotes = adminNotes;
            this.address = address;
            this.referredBy = referredBy;
            this.relationships = relationships;
        }
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

    constructor(
        username: string,
        nickname: string,
        email: string,
        password1: string,
        password2: string,
        firstName: string,
        middleName: string,
        lastName: string,
        mobileNumber: string,
        birthDate: string
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