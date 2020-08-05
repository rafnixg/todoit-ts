import { v4 as uuidv4 } from 'uuid';

class TodoItem {
    private readonly _creationTimestamp: number;
    private readonly _identifier: string;

    constructor(private _description: string, identifier?: string) {
        this._creationTimestamp = new Date().getTime();

        if (identifier) {
            this._identifier = identifier;
        } else {
            // this is just for the example; for any real project, use
            // UUIDs instead: https://www.npmjs.com/package/uuid
            this._identifier = uuidv4();
        }
    }

    get creationTimestamp(): number {
        return this._creationTimestamp;
    }

    get identifier(): string {
        return this._identifier;
    }

    get description(): string {
        return this._description;
    }
}

