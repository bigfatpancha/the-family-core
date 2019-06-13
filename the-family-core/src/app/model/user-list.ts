import { UserRole } from './user';

export interface Coordinate {
    latitude: number,
    longitude: number
}

export class FamilyUserList {
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
    results: FamilyUserList[];

    constructor(
        count: number,
        next: any,
        previous: any,
        results: FamilyUserList[]) {
            this.count = count;
            this.next = next;
            this.previous = previous;
            this.results = results;
        }
}

export class UserList {
    id: number;
    username: string;
    avatar:	string; // a chequear si es URL o lo dejo como string
    firstName: string;
    lastName: string;
    coordinate:	Coordinate;

    constructor(
        id: number,
        username: string,
        avatar:string,
        firstName: string,
        lastName: string,
        coordinate: Coordinate) {
            this.id = id;
            this.username = username;
            this.avatar = avatar;
            this.firstName = firstName;
            this.lastName = lastName;
            this.coordinate = coordinate;
    }
}

export class UserListResponse {
    count: number;
    next: any;
    previous: any;
    results: UserList[];

    constructor(
        count: number,
        next: any,
        previous: any,
        results: UserList[]) {
            this.count = count;
            this.next = next;
            this.previous = previous;
            this.results = results;``
    }
}