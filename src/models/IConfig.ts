/**
 * Created by sasha on 6/6/17.
 */
import  {Options} from 'sequelize'
import * as path from "path";
export interface IDBConfig{
    dbName?: string,
    name?: string,
    password?: string,
    options?: Options
}
export  interface ISecrets{
    session: string
}
export interface ISocialCreds{
    clientID: string;
    clientSecret: string;
    callbackURL?: string;
    apiKey?: string;
}
export interface IConfig{
    userRoles: Array<string>;

    env: string,
    // Root path of server
    root?: string,

    // Server port
    port?: number,

    // Server IP
    ip?: string,

    // Should we populate the DB with sample data?
    seedDB?: boolean
    // Secret for session, you will want to change this and make it an environment variable
    secrets?: ISecrets;

    authConfig?: Map<string, ISocialCreds>;

    dbConfig?: IDBConfig;
}
export class ServerConfig implements IConfig{
    userRoles: Array<string> = ['guest', 'user', 'admin'];
    root=path.normalize(`${__dirname}/../../..`);
    env= process.env.NODE_ENV;
    port: number;
    ip: string;
    seedDB: boolean;
    secrets: ISecrets;
    authConfig: Map<string, ISocialCreds>;
    dbConfig: IDBConfig;
}