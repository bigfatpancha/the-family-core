export class ImportCalendarPost {
    refresh_token: string;

    constructor(token: string) {
        this.refresh_token = token;
    }
}