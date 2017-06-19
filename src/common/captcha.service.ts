/**
 * Created by sasha on 6/19/17.
 */
import {post, RequestResponse} from "request";
import {Config} from "../config/environment";
import * as Bluebird from "bluebird";

const API_URL = "https://www.google.com/recaptcha/api/siteverify";

export class GoogleCaptchaService{
    public verifyCaptcha(token: string): Bluebird<any>{
        return new Bluebird((resolve: () => void, reject: (any) => void) => {
            post(API_URL, { body: {secret: Config.secrets.reCaptchaSecrer, response: token}} ,
                (error, res: RequestResponse, body) => {
                if (error) return reject(error);
                return resolve();
            });
        });
    }
}
export const captureServiceInstance = new GoogleCaptchaService();
