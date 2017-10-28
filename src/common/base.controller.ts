/**
 * Created by sasha on 5/12/17.
 */
import {NextFunction, Request, Response} from "express";
import * as jsonpatch from "fast-json-patch";
import {FindOptions, ValidationError} from "sequelize";
import * as Sequelize from "sequelize";
import * as Promise from "bluebird";
import {ServerError} from "../models/IError";
import {buildQueryByParams, ISearchParams, sortSortParrams} from "./query.builder";
import {string} from "joi";
const debug = require("debug")("test.base.controller");

export class BaseController<Entity extends Sequelize.Model<any, any>> {
    constructor(protected entity: Entity) {

    }

    public index = (req: Request, res: Response, next: NextFunction) => {
        return this.entity.findAll()
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    };
    /**
     * Model pagination function
     * @param {sequelize.FindOptions<any>} options
     * @param {Object} query
     * @param {[string] | [ISearchParams]} rules
     * @param {sequelize.Model<TInstance, TAttributes>} model
     * @returns {Bluebird<{rows: TInstance[]; count: number; limit?: number; offset?: number}>}
     */
    public findWithPagination = <TInstance, TAttributes>(options: FindOptions<any>, query: object = {},
                                                         rules: string[] | [ISearchParams] = [] as string[],
                                                         model: Sequelize.Model<TInstance, TAttributes> = this.entity):
        Promise<{ rows: TInstance[], count: number, limit?: number, offset?: number }> => {
        options.where = buildQueryByParams(options.where || {}, query, rules);
        options.limit = parseInt(query["limit"], 10) || 50;
        options.offset = parseInt(query["offset"], 10) || 0;
        if (query["sort"] && rules.length
            && typeof rules[0] === "string") options.order = sortSortParrams(rules as string[], query["sort"]);
        return model.findAndCount(options)
            .then((data: any) => {
                data.limit = options.limit;
                data.offset = options.offset;
                return data;
            });
    };
// Gets a single Thing from the DB
    public show = (req: Request, res: Response, next: NextFunction) => {
        return this.entity.find({
            where: {
                _id: req.params.id,
            },
        })
            .then(this.handleEntityNotFound(res))
            .then(this.respondWithResult(res))
            .catch(this.handleError(res));
    }

// Creates a new Thing in the DB
    public create = (req: Request, res: Response, next: NextFunction) => {
        return this.entity.create(req.body)
            .then(this.respondWithResult(res, 201))
            .catch(this.handleError(res));
    }

// Updates an existing Thing in the DB
    public patch = (req: Request, res: Response, next: NextFunction) => {
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
    }

// Deletes a Thing from the DB
    public destroy = (req: Request, res: Response, next: NextFunction) => {
        return this.entity.find({
            where: {
                _id: req.params.id,
            },
        })
            .then(this.handleEntityNotFound(res))
            .then(this.removeEntity(res))
            .catch(this.handleError(res));
    }

    protected handleError(res: Response, statusCode: number = 500) {
        return (err) => {
            debug(err);
            if (err instanceof ServerError) {
                return res.status(err.status).json({message: err.error});
            } else if (err instanceof ValidationError) {
                return res.status(422).json((err as ValidationError).errors || err);
            }
            return res.status(statusCode).send(err);
        };
    }
    protected handleErrorSync(res: Response, err: any, statusCode: number = 500) {
        debug(err);
        if (err instanceof ServerError) {
            return res.status(err.status).json({message: err.error});
        } else if (err instanceof ValidationError) {
            return res.status(422).json((err as ValidationError).errors || err);
        }
        return res.status(statusCode).send(err);
    }

    protected respondWithResult(res: Response, statusCode: number = 200) {
        return (entity) => {
            if (entity) {
                return res.status(statusCode).json(entity);
            }
            return null;
        };
    }
    protected respondWithResultSync(res: Response, entity: any, statusCode: number = 200) {
        return res.status(statusCode).json(entity);
    }
    protected handleEntityNotFound(res: Response) {
        return (entity) => {

            if (!entity || (entity instanceof Array && !entity.length)) {
                res.status(404).end();
                return null;
            }
            return entity;
        };
    }
    protected handleEntityNotFoundSync(res: Response, entity: any) {

        if (!entity || (entity instanceof Array && !entity.length)) {
            return res.status(404).end();
        }
        return entity;
    }

    protected validationError(res: Response, statusCode: number = 422) {
        return (err) => {
            return res.status(statusCode).json(err);
        };
    }

    protected removeEntity(res: Response) {
        return (entity) => {
            if (entity) {
                return entity.destroy()
                    .then(() => {
                        res.status(204).end();
                    });
            }
        };
    }

    protected patchUpdates(patches) {
        return (entity) => {
            try {
                // eslint-disable-next-line prefer-reflect
                jsonpatch.applyPatch(entity, patches, /*validate*/ true);
            } catch (err) {
                return Promise.reject(err);
            }
            return entity.save();
        };
    }
}
