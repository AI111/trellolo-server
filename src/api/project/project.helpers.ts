import {db} from "../../sqldb";
import * as Promise from "bluebird";
import {ServerError} from "../../models/IError";
import {NextFunction, Request, Response} from "express";

/**
 * Created by sasha on 7/8/17.
 */
export let checkProjectAccessRights = (userId: number, projectId: number,
                                          roles: [string] = ['admin', 'creator']): Promise<void> =>{
    console.log(db.Team);
    return db.Team.findAll({
        where: {
            projectId: projectId,
            userId: userId,
            accessRights: {
                $in: roles
            }
        }
    }).then(team => {
        if(!team.length) return Promise.reject(new ServerError('Yo not have access rights for editing this group',403));
        return team;
    })
};
export function checkProject(req: Request, res: Response, next: NextFunction){
    if(!req.headers.project) res.status(400).send('project id header is required');
    req['project'] = req.headers.project;
    next();
}
