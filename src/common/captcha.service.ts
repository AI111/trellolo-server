/**
 * Created by sasha on 6/19/17.
 */
/**
 * Created by sasha on 6/19/17.
 */
import {post, RequestResponse} from "request";
import {config} from "../config/environment";
import * as debug from "debug";
import * as Promise from "bluebird";
import {NextFunction, Request, Response} from "express";
const API_URL = "https://www.google.com/recaptcha/api/siteverify";
debug("ts-express:server");
export class GoogleCaptchaService{
    public verifyCaptcha(token: string): Promise<any>{
        if(!token || !token.length) return Promise.reject("token is not defined");
        return new Promise((resolve: () => void, reject: (any) => void) => {
            if(config.env === 'test') return resolve();
            post(API_URL,{form: {secret: config.secrets.reCaptchaSecrer, response: token}} ,
                (error, res: RequestResponse, body) => {
                if (error || !JSON.parse(body).success) return reject(error || body);
                return resolve();
            });
        });
    }
}
export const captureServiceInstance = new GoogleCaptchaService();

export const captchaMiddleware = (req: Request,res: Response, next : NextFunction) => {
    captureServiceInstance.verifyCaptcha(req.body.token)
            .then(() => next())
            .catch((err) => res.status(403).json({"message":"captcha token invalid"}))
};