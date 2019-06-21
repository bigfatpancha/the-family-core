export interface LoginRequest {
    username: string;
    email: string;
    password: string;
}

export class User {
    id: number;
    role: number;
    username: string;
    nickname: string;
    avatar: string;
    email: string;
    sendbirdId: string;
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
    allergies: string;
    favorites: string;
    dislikes: string;
    wishlist: string;
    adminNotes: string;
    address: string;
    referredBy: string;

    constructor(
        id: number,
        role: number,
        username: string,
        nickname: string,
        avatar: string,
        email: string,
        sendbirdId: string,
        firstName: string,
        middleName: string,
        lastName: string,
        gender: number,
        mobileNumber: string,
        birthDate: string,
        height: string,
        weight: string,
        hairColor: string,
        eyeColor: string,
        bloodType: string,
        countryOfCitizenship: string,
        passportNumber: string,
        socialSecurityNumber: string,
        schoolState: string,
        school: string,
        grade: string,
        topSize: string,
        bottomsSize: string,
        shoeSize: string,
        braSize: string,
        shirtSize: string,
        pantsSize: string,
        allergies: string,
        favorites: string,
        dislikes: string,
        wishlist: string,
        adminNotes: string,
        address: string,
        referredBy: string) {
            this.id = id;
            this.role = role;
            this.username = username;
            this.nickname = nickname;
            this.avatar = avatar;
            this.email = email;
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
    email: string;
    password1: string;
    password2: string;

    constructor(
        username: string,
        email: string,
        password1: string,
        password2: string
    ) {
        this.username = username;
        this.email = email;
        this.password1 = password1;
        this.password2 = password2;
    }
}

export class RegistrationResponse {
    key: string;

    constructor(key: string) {
        this.key = key;
    }
}