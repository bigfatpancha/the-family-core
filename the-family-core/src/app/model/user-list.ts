export class UserList {
    id: number;
    username: string;
    avatar:	string; // a chequear si es URL o lo dejo como string
    firstName: string;
    lastName: string;
    coordinate:	string;

    constructor(id: number,
        username: string,
        avatar:string,
        firstName: string,
        lastName: string,
        coordinate: string) {
            this.id = id;
            this.username = username;
            this.avatar = avatar;
            this.firstName = firstName;
            this.lastName = lastName;
            this.coordinate = coordinate;
    }
}