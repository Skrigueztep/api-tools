import {HttpStatus} from "../enums/http-status";
import {Entity} from "./entity";

export class Auth<T> implements Entity<T> {
    code: HttpStatus;
    description: string;
    item: T;
    token: string;

    constructor(code: HttpStatus, description: string, item: T, token: string) {
        this.code = code;
        this.description = description;
        this.item = item;
        this.token = token;
    }

}
