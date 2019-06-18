import { Address } from './contact';
import { FamilyUser } from './family';

export class EventAttachment {
    id: number;
    file: string;
    thumbnail: string;

    constructor(
        id: number,
        file: string,
        thumbnail: string
    ) {
        this.id = id;
        this.file = file;
        this.thumbnail = thumbnail;
    }
}

export class Event {
    id: number;
    title: string;
    detail: string;
    type: number; // 0, 1, 2
    familyMembers: number[];
    start: string;
    end: string;
    recurrence: string;
    recurrenceDescription: string;
    timezone: string;
    alert: number; // 0, 1, 2, 3
    notifyTeam:	boolean;
    notes: string;
    address: Address;
    attachments: EventAttachment[];

    constructor(
        id: number,
        title: string,
        detail: string,
        type: number,
        familyMembers: number[],
        start: string,
        end: string,
        recurrence: string,
        recurrenceDescription: string,
        timeZone: string,
        alert: number,
        notifyTeam: boolean,
        notes: string,
        address: Address,
        attachments: EventAttachment[]
    ) {
        this.id = id;
        this.title = title;
        this.detail = detail;
        this.type = type;
        this.familyMembers = familyMembers;
        this.start = start;
        this.end = end;
        this.recurrence = recurrence;
        this.recurrenceDescription = recurrenceDescription;
        this.timezone = timeZone;
        this.alert = alert;
        this.notifyTeam = notifyTeam;
        this.notes = notes;
        this.address = address;
        this.attachments = attachments;
    }
}

export class EventResponse {
    count: number;
    next: any;
    previous: any;
    results: Event[];

    constructor(
        count: number,
        next: any,
        previous: any,
        results: Event[]
    ) {
        this.count = count;
        this.next = next;
        this.previous = previous;
        this.results = results;
    }
}