/**
 * Created by sasha on 6/19/17.
 */
import {post, RequestResponse} from "request";
import {Config} from "../config/environment";
import * as debug from "debug";
import * as Promise from "bluebird";
const API_URL = "https://www.google.com/recaptcha/api/siteverify";
debug("ts-express:server");
export class GoogleCaptchaService{
    public verifyCaptcha(token: string): Promise<any>{
        return new Promise((resolve: () => void, reject: (any) => void) => {
            post(API_URL,{json: {secret: Config.secrets.reCaptchaSecrer, response: token}} ,
                (error, res: RequestResponse, body) => {
                if (error || !body.success) return reject(error);
                return resolve();
            });
        });
    }
}
export const captureServiceInstance = new GoogleCaptchaService();
