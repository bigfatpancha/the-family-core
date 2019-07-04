export class Timezone {
    name: string;
    description: string;
    offset: number;

    constructor(
        name: string,
        description: string,
        offset: number
    ) {
        this.name = name;
        this.description = description;
        this.offset = offset;
    }
}