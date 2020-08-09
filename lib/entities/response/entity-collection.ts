import {Default} from "./default";
import {HttpStatus} from "../enums/http-status";

export class EntityCollection<T> implements Default {
    code: HttpStatus;
    description: string;
    items: T[];

    constructor(code: HttpStatus, description: string, items: T[]) {
        this.code = code;
        this.description = description;
        this.items = items;
    }

}
