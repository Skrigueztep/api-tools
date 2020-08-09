import {Default} from "./default";
import {HttpStatus} from "../enums/http-status";

export class Entity<T> implements Default {
    code: HttpStatus;
    description: string;
    item: T;

    constructor(code: HttpStatus, description: string, item: T) {
        this.code = code;
        this.description = description;
        this.item = item;
    }

}
