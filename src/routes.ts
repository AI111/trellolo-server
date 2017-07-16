/**
 * Created by sasha on 5/12/17.
 */
import {Application} from "express";
import * as path from "path";

export function initRouter(app: Application) {
    // Insert routes below
    // app.use('/api/users', require('./api/user'));

    app.use("/auth", require("./auth").default());
    app.use("/api/users", require("./api/user"));

    app.use("/api/projects", require("./api/project").default());
    // All undefined asset or api routes should return a 404
    app.use("/api/projects", require("./api/board").default())

}
