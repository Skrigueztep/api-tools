import {readFileSync} from "fs";
import {Default} from "../../entities/response/default";
import {HttpStatus} from "../../entities/enums/http-status";
import {verify} from "jsonwebtoken";

export class AuthValidationService {

    constructor() {
    }

    async authenticate(bearerHeader: string, email: string, token: string, privateKeyLocation: string): Promise<Default> {
        const authHeader: string = this.extractToken(bearerHeader);
        const validation: Authentication = await this.validateUserAuth(email, token, authHeader, privateKeyLocation);
        let response: Default = new Default(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
        switch (validation) {
            case Authentication.INVALID_AUTHORIZATION_HEADER:
                response = new Default(HttpStatus.UNAUTHORIZED, 'Bad credentials, Invalid token');
                break;
            case Authentication.EXPIRED_TOKEN:
                response = new Default(HttpStatus.INVALID_OR_EXPIRED_TOKEN, 'Token Expired');
                break;
            case Authentication.BAD_CREDENTIALS:
                response = new Default(HttpStatus.INVALID_OR_EXPIRED_TOKEN, 'Bad credentials, this token does not correspond to this user');
                break;
            case Authentication.OK:
                response = new Default(HttpStatus.OK, 'Successfully');
                break;
        }
        return response;
    }

    private extractToken(header: string): string {
        const bearerHeader: string[] = header.split(' ');
        return bearerHeader[1];
    }

    private async validateUserAuth(email: string, token: string, header: string, privateKeyLocation: string): Promise<Authentication> {
        if (token !== header) return Authentication.INVALID_AUTHORIZATION_HEADER;

        const privateKey: Buffer = readFileSync(privateKeyLocation);
        const tokenVerification: any = verify(token, privateKey, { algorithms: ["RS256"]  });

        const { userEmail, expiresIn } = tokenVerification.data;
        if (new Date().toDateString() >= new Date(expiresIn).toDateString()) return Authentication.EXPIRED_TOKEN;
        if (email !== userEmail) return Authentication.BAD_CREDENTIALS;
        return Authentication.OK;
    }

}

export enum Authentication {
    'INVALID_AUTHORIZATION_HEADER',
    'EXPIRED_TOKEN',
    'BAD_CREDENTIALS',
    'OK',
}
