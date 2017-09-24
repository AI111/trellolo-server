/**
 * Created by sasha on 6/6/17.
 */
import * as path from "path";
import  {Options} from "sequelize";
export interface IDBConfig{
    uri?: string;
    dbName?: string;
    name?: string;
    password?: string;
    options?: Options;
}
export  interface ISecrets{
    session: string;
    reCaptchaSecrer: string;
}
export interface ISocialCreds{
    clientID: string;
    clientSecret: string;
    callbackURL?: string;
    apiKey?: string;
}
export interface ISocialProviders {
    google: ISocialCreds;
    github: ISocialCreds;
}
export interface IConfig{
    userRoles?: string[];

    env?: string;
    // Root path of server
    root?: string;

    // Server port
    port?: number;

    // Server IP
    ip?: string;

    // Should we populate the DB with sample data?
    seedDB?: boolean;
    // Secret for session, you will want to change this and make it an environment variable
    secrets?: ISecrets;

    authConfig?: ISocialProviders;

    dbConfig?: IDBConfig;
}
