import {db} from "../../sqldb/index";
import * as Promise from "bluebird";
import {ServerError} from "../../models/IError";
import {NextFunction, Request, Response} from "express";
import {ProjectAccessRights} from "../../models/team/ITeam";

/**
 * Created by sasha on 7/8/17.
 */
export const checkProjectAccessRights = (userId: number, projectId: number,
                                          roles: [ProjectAccessRights] = ['admin', 'creator']): Promise<void> =>{
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

