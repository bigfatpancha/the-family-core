export class Attachment {
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

export class Document {
    id: number;
    title: string;
    description: string;
    type: number;
    familyMembers: number[];
    notifyTeam: boolean;
    notes: string;
    attachments: Attachment;

    constructor(
        id: number,
        title: string,
        description: string,
        type: number,
        familyMembers: number[],
        notifyTeam: boolean,
        notes: string,
        attachments: Attachment
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type;
        this.familyMembers = familyMembers;
        this.notifyTeam = notifyTeam;
        this.notes = notes;
        this.attachments = attachments;
    }
}

export class DocumentResponse {
    count: number;
    next: string;
    previous: string;
    results: Document[];

    constructor(
        count: number,
        next: string,
        previous: string,
        results: Document[]
    ) {
        this.count = count;
        this.next = next;
        this.previous = previous;
        this.results = results;
    }
}