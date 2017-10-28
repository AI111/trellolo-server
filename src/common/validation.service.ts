/**
 * Created by sasha on 6/20/17.
 */
import {NextFunction, Request, Response} from "express";
import {ObjectSchema, validate} from "joi";
import {JoiValidationError, ServerError} from "../models/IError";
export const validateReauest = (schema: ObjectSchema, key: string = "body") => {
    return function(req: Request, res: Response, next: NextFunction) {
        const result = validate(req[key], schema);
        if(!result.error) return next();
        next(new JoiValidationError(result.error));
    }
}