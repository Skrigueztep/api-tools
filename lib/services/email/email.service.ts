import Mail from "nodemailer/lib/mailer";
import {createTransport, SentMessageInfo} from "nodemailer";
import {Default} from "../../entities/response/default";
import {render} from "ejs";
import {HttpStatus} from "../../entities/enums/http-status";

export class EmailService {

    private _config: Config;

    constructor(config: Config) {
        this._config = config;
    }

    /**
     *
     * data.template value passed should be equal to result of call to readFileSync('', { encoding: "utf-8" }).
     * Ej:
     *  const template: string = readFileSync('', { encoding: "utf-8" });
     * */
    sendEmail<T>(data: Data<T>): Promise<Default> {
        return new Promise((resolve) => {
            const transporter: Mail = createTransport({
                service: (this._config.provider) ? this._config.provider : 'Gmail',
                auth: {
                    user: this._config.user,
                    pass: this._config.password
                }
            });

            const template: string = render(data.template, data.content);

            const options: Mail.Options = {
                from: (this._config.from) ? this._config.from : this._config.user,
                to: this._config.to,
                subject: this._config.subject,
                html: template
            };
            transporter.sendMail(options, (error: Error | null, info: SentMessageInfo) => {
                if (error) {
                    resolve(new Default(HttpStatus.INTERNAL_SERVER_ERROR, error.message));
                } else {
                    resolve(new Default(HttpStatus.OK, 'Successfully'));
                }
            });
        });
    }

}

export interface Config {
    user: string;
    password: string;
    provider?: string;
    from?: string;
    to: string;
    subject: string;
}

export interface Data<T> {
    template: string;
    content: T;
}
