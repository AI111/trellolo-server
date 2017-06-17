/**
 * Created by sasha on 5/12/17.
 */
import * as path from 'path';
import {Application} from "express";

export function initRouter(app: Application) {
    // Insert routes below
    // app.use('/api/users', require('./api/user'));

    app.use('/auth', require('./auth').default);

    // All undefined asset or api routes should return a 404

}
