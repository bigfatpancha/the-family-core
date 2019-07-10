import { Address } from './contact';
import { FamilyUser } from './family';

export class EventAttachment {
    id: number;
    file: File;
    thumbnail: string;
}

export class Event {
    id: number;
    title: string;
    detail: string;
    type: number; // 0, 1, 2
    familyMembers: number[];
    lead: number;
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