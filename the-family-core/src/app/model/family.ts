export enum UserRole { 
    ADMIN = 'Admin', 
    LEGAL_GUARDIAN = 'Co-Parent / Legal Guardian', 
    CHILD = 'Child', 
    DEPENDENT = 'Dependent', 
    NANNY = 'Nanny / Caregiver / Babysitter' 
}

export interface Coordinate {
    latitude: number,
    longitude: number
}

export class FamilyUser {
    id: number;
    role: number;
    username: string;
    nickname: string;
    avatar: string;
    email: string;
    sendbirdId: string;
    coordinate: string
    
    constructor(
        id: number,
        role: number,
        username: string,
        nickname: string,
        avatar: string,
        email: string,
        sendbirdId: string,
        coordinate: string) {
            this.id = id;
            this.role = role;
            this.username = username;
            this.nickname = nickname;
            this.avatar = avatar;
            this.email = email;
            this.sendbirdId = sendbirdId;
            this.coordinate = coordinate;
    }
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
