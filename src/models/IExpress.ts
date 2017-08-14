import {Request} from "express";
import * as SocketIO from "socket.io";
import {IUserAttributes, IUserInstance} from "./user/IUser";

/**
 * Created by sasha on 7/8/17.
 */
export interface Request extends Request{
    projectId?: number;
    user?: IUserInstance;
    filePath: string;
}
export interface ISocket extends SocketIO.Socket{
    decoded_token: IUserAttributes,

}