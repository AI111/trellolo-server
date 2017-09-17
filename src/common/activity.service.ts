import * as Promise from "bluebird";
import { compare } from "fast-json-patch";
import {IActivityInstance} from "../models/activity/IActivity";
import {Request} from "../models/IExpress";
import {db} from "../sqldb";
export function logActivity(req: Request, messageId: number): (e: any) => object {
    return (entity) => {
       return db.Activity.create({
            userId: req.user._id,
            messageId,
            table: entity._modelOptions.name.plural,
            tableId: entity._id,
        })
           .then(() => entity);
    };
}
export function normalizeObject(obj: object): object{
    for (let prop in obj) {
        if (obj[prop] instanceof Date) obj[prop] = obj[prop].toUTCString();
    }
    return obj;
}

export function saveActivity(req: Request, messageId: number, entity: any, prevEntity?: object): Promise<IActivityInstance> {
    return db.Activity.create({
            userId: req.user._id,
            messageId,
            table: entity._modelOptions.name.plural,
            tableId: entity._id,
            diff: compare( normalizeObject(entity.dataValues), normalizeObject(prevEntity)),
        });
}
