"use strict";
import * as express from "express";
import {Router} from "express";
import {Config as config} from "../config/environment";
import {db} from "../sqldb";
import {setup as localSetup} from "./local/passport";
import {setup as googleSetup} from "./google/passport";
import {setup as githubSetup} from "./github/passport";
// Passport Configuration
localSetup(db.User, config);
googleSetup(db.User, config);
githubSetup(db.User, config);
// require('./facebook/passport').setup(DBConnection.User, config);
// require('./google/passport').setup(DBConnection.User, config);
// require('./twitter/passport').setup(DBConnection.User, config);

export default function() {
    const router = Router();

    router.use("/local", require("./local").default);
// router.use('/facebook', require('./facebook').default);
// router.use('/twitter', require('./twitter').default);
    router.use('/google', require('./google').default);
    router.use('/github', require('./github').default);
    return router;
}
