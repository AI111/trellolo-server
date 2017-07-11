/**
 * Created by sasha on 6/7/17.
 */
import {Instance} from "sequelize";
import {IUserInstance} from "../user/IUser";
import {IBoardInstance} from "../board/IBoard";
import { IProjectInstance} from "../project/IProject";
export enum ProjectAccessRights{
    user = 'user',
    admin = 'admin',
    creator = 'creator'
}
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
    associate(models)
}
