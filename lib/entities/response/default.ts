import {HttpStatus} from "../enums/http-status";

export class Default {
    code: HttpStatus;
    description: string;

    constructor(code: HttpStatus, description: string) {
        this.code = code;
        this.description = description;
    }

}
