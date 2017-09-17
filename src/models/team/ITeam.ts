/**
 * Created by sasha on 6/7/17.
 */
import {Instance} from "sequelize";
import { IProjectInstance} from "../project/IProject";
import {IUserInstance} from "../user/IUser";
export type  ProjectAccessRights = "user"| "admin" | "creator";
export interface ITeamAttributes {
    _id?: number;
    name?: string;
    creator?: IUserInstance;
    user?: IUserInstance|number;
    userId?: number;
    project?: IProjectInstance|number;
    projectId?: number;
    teamName?: string;
    accessRights?: ProjectAccessRights;
}

export interface ITeamInstance  extends Instance<ITeamAttributes>, ITeamAttributes {
    dataValues: ITeamAttributes;
    associate(models);
}
