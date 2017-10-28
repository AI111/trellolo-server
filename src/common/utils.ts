import {NextFunction, Response} from "express";
import {ValidationError} from "sequelize";
import {JoiValidationError, ServerError} from "../models/IError";
import {Request} from "../models/IExpress";
import {flattenDeep, values} from "lodash";
const debug = require("debug")("common.utils");
import {unlink} from "fs";
export function deleteFiles(path: string[]
    | string
    | Express.Multer.File[]
    | Express.Multer.File
    | {[fieldname: string]: Express.Multer.File[]}): Promise<any[] | void> {
    if (!path) return Promise.resolve();
    const pathArr: string []  =  ((path instanceof Array)
        ? ((path[0].hasOwnProperty("path")) && path
            || flattenDeep(values(path)) as any)
        : [path])
        .map((f) => ((typeof f === "string") ? f : f.path));
    return Promise.all(
        pathArr.map((file) => new Promise((resolve: () => void, reject: (err: any) => void) => {
            unlink(file, (err) => {
                if (err) reject(err);
                resolve();
            });
        })),
    );
}
export async function expressErrorHeandler(err: any, req: Request, res: Response, next: NextFunction) {
    // logic
    const file = req.files || req.files || req.filePath;
    if (file) await deleteFiles(file);
    if (err instanceof ServerError) {
        res.status(err.status).json({message: err.error});
    } else if (err instanceof ValidationError) {
        res.status(422).json((err as ValidationError).errors || err);
    } else if (err instanceof JoiValidationError) {
        res.status(422).json(err.details);
    }
     next(err);
}
