export class Attachment {
    id: number;
    file: File;
    thumbnail: string;
}

export class Document {
    id: number;
    title: string;
    description: string;
    type: number;
    familyMembers: number[];
    notifyTeam: boolean;
    notes: string;
    attachments: Attachment[];
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