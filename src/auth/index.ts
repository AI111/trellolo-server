"use strict";
import * as express from "express";
import {Router} from "express";
import { config} from "../config/environment";
import {db} from "../sqldb";
import {setup as githubSetup} from "./github/passport";
import {setup as googleSetup} from "./google/passport";
import {setup as localSetup} from "./local/passport";
// Passport Configuration
localSetup(db.User, config);
googleSetup(db.User, config);
githubSetup(db.User, config);
export default function() {
    const router = Router();

    router.use("/local", require("./local").default);
    router.use("/google", require("./google").default);
    router.use("/github", require("./github").default);
    return router;
}
