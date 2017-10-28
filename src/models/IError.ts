/**
 * Created by sasha on 7/8/17.
 */
import {ValidationError, ValidationErrorItem} from "joi";

export interface IServerError {
    status: number;
    error: string | object;
}
export class ServerError implements IServerError {
    constructor(public error: string | object, public status: number = 500 ) {
    }
}
export class JoiValidationError implements ValidationError {
    public details: ValidationErrorItem[];
    public _object: any;
    public name: string;
    public message: string;
    public isJoi: boolean;
    constructor(error: ValidationError){
        this.details = error.details;
        this.message = error.message;
        this.isJoi = error.isJoi;
    }
    public annotate(): string {
        return undefined;
    }

}
