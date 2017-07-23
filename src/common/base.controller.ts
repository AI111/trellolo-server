/**
 * Created by sasha on 5/12/17.
 */
import {NextFunction, Request, Response} from "express";
import * as jsonpatch from "fast-json-patch";
import {ValidationError} from "sequelize";
import * as Sequelize from "sequelize";

import {ServerError} from "../models/IError";
export class BaseController<Entity extends Sequelize.Model <any, any>>{
    constructor(protected entity: Entity) {

    }

    public index = (req: Request, res: Response) => {
        return this.entity.findAll()
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    };

    // Gets a single Thing from the DB
    public show = (req: Request, res: Response, next?: NextFunction) => {
        return this.entity.find({
            where: {
                _id: req.params.id,
            },
        })
            .then(this.handleEntityNotFound(res))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    };

// Creates a new Thing in the DB
    public create = (req: Request, res: Response) => {
        return this.entity.create(req.body)
        .then(this.respondWithResult(res, 201))
            .catch(this.handleError(res));
    };

// Upserts the given Thing in the DB at the specified ID
//     public upsert(req:Request, res: Response) {
//     if(req.body._id) {
//         Reflect.deleteProperty(req.body, '_id');
//     }
//
//     return this.entity.upsert(req.body, {
//         where: {
//             _id: req.params.id
//         }
//     })
//         .then(this.respondWithResult(res))
//         .catch(this.handleError(res));
// }

// Updates an existing Thing in the DB
    public patch = (req: Request, res: Response) => {
        console.log('    public patch = (req: Request, res: Response) => {');
        if (req.body._id) {
            Reflect.deleteProperty(req.body, "_id");
        }
        return this.entity.find({
            where: {
                _id: req.params.id,
            },
        })
            .then(this.handleEntityNotFound(res))
            .then(this.patchUpdates(req.body))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    };

// Deletes a Thing from the DB
    public destroy = (req: Request, res: Response) => {
        return this.entity.find({
            where: {
                _id: req.params.id,
            },
        })
            .then(this.handleEntityNotFound(res))
            .then(this.removeEntity(res))
            .catch(this.handleError(res));
    };

    protected handleError(res: Response, statusCode: number = 500) {
        return function(err) {
            if(err instanceof ServerError){
                return res.status(err.status).json({message:err.error});
            }else if(err instanceof ValidationError){
                return res.status(422).json((<ValidationError>err).errors||err);
            }
            return res.status(statusCode).send(err);
        };
    }
    protected respondWithResult(res: Response, statusCode: number= 200) {
        return function(entity) {
            if (entity) {
                return res.status(statusCode).json(entity);
            }
            return null;
        };
    }
    protected handleEntityNotFound(res: Response) {
        return function(entity) {
            if (!entity) {
                res.status(404).end();
                return null;
            }
            return entity;
        };
    }
    protected validationError(res: Response, statusCode: number= 422) {
        return function(err) {
            return res.status(statusCode).json(err);
        };
    }
    protected removeEntity(res: Response) {
        return function(entity) {
            if (entity) {
                return entity.destroy()
                    .then(() => {
                        res.status(204).end();
                    });
            }
        };
    }
    protected patchUpdates(patches) {
        return function(entity) {
            try {
                // eslint-disable-next-line prefer-reflect
                jsonpatch.default.apply(entity, patches, /*validate*/ true);
            } catch (err) {
                return Promise.reject(err);
            }
            return entity.save();
        };
    }
}
