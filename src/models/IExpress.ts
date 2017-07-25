import {Request} from "express";
import {IUserInstance} from "./user/IUser";
/**
 * Created by sasha on 7/8/17.
 */
export interface Request extends Request{
    projectId?:number;
    user?: IUserInstance;
    filePath: string;
}