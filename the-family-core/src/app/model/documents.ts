import { FormGroup } from '@angular/forms';

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

    constructor(form: FormGroup) {
        this.title = form.get('title').value;
        if (form.get('detail').dirty) {
          this.description = form.get('detail').value;
        }
        this.type = form.get('type').value.id;
        this.notifyTeam = form.get('notifyTeam').value;
        if (form.get('notes').dirty) {
            this.notes = form.get('notes').value;
        }
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