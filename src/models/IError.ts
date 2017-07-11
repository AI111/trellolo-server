/**
 * Created by sasha on 7/8/17.
 */
export interface IServerError{
    status: number;
    error: string | object
}
export class ServerError implements IServerError{
    constructor(public error: string | Object, public status: number=500 ) {
    }
}