export enum UserRole { 
    ADMIN = 'Admin', 
    LEGAL_GUARDIAN = 'Co-Parent / Legal Guardian', 
    CHILD = 'Child', 
    DEPENDENT = 'Dependent', 
    NANNY = 'Nanny / Caregiver / Babysitter' 
}

export class Coordinate {
    latitude: number;
    longitude: number;
}

export class FamilyUser {
    id: number;
    role: number;
    username: string;
    nickname: string;
    avatar: string;
    stars: number;
    familyId: number;
    password1: string;
    password2: string;
    email: string;
    colorCode: string;
    mobileNumber: string;
    sendbirdId: string;
    coordinate: Coordinate
    
}

export class FamilyUserListResponse {
    count: number;
    next: any;
    previous: any;
    results: FamilyUser[];

    constructor(
        count: number,
        next: any,
        previous: any,
        results: FamilyUser[]) {
            this.count = count;
            this.next = next;
            this.previous = previous;
            this.results = results;
        }
}
