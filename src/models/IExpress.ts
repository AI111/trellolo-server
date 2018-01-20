import {Request} from "express";
import * as SocketIO from "socket.io";
import {IUserAttributes, IUserInstance} from "./user/IUser";
import RedisAdapter = SocketIORedis.RedisAdapter;

/**
 * Created by sasha on 7/8/17.
 */
export interface Request extends Request{
    projectId?: number;
    boardId?: number;
    user?: IUserInstance;
    filePath: string;
}
export interface CustomRedisAdaptor extends RedisAdapter {
    clients(rooms: string[], callback: (err: any, clients: string[]) => void): void;
    clients(callback: (err: any, clients: string[]) => void): void;
}
export interface ISocket extends SocketIO.Socket {
    decoded_token: IUserAttributes;
    adapter: CustomRedisAdaptor;
}