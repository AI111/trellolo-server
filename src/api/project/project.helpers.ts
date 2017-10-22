import * as Promise from "bluebird";
import {NextFunction, Request, Response} from "express";
import {ServerError} from "../../models/IError";
import {ProjectAccessRights} from "../../models/team/ITeam";
import {db} from "../../sqldb";

/**
 * Created by sasha on 7/8/17.
 */
export function  checkProjectAccessRights(userId: number, projectId: number,
                                          roles: [ProjectAccessRights] = ["admin", "creator"]): Promise<void> {
    return db.Team.findAll({
        where: {
            projectId,
            userId,
            accessRights: {
                $in: roles,
            },
        },
    }).then((team) => {
        if (!team.length) return Promise.reject(new ServerError("Yo not have access rights for editing this project", 403));
        return team;
    });
}
