/**
 * Created by sasha on 5/12/17.
 */
import { Schema } from "mongoose";
import { Response } from "express";
export class BaseController<Entity extends Schema>{
    // constructor()
    protected validationError(res:Response, statusCode:number=422) {
        return function(err) {
            return res.status(statusCode).json(err);
        };
    }
    protected handleError(res:Response, statusCode:number=500) {
        return function(err) {
            return res.status(statusCode).send(err);
        };
    }
    protected respondWithResult(res:Response, statusCode:number=200) {
        return function(entity) {
            if(entity) {
                return res.status(statusCode).json(entity);
            }
            return null;
        };
    }
    protected handleEntityNotFound(res:Response) {
        return function(entity) {
            if(!entity) {
                res.status(404).end();
                return null;
            }
            return entity;
        };
    }
}