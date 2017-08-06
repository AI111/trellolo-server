/**
 * Created by sasha on 6/10/17.
 */

"use strict";

import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as errorHandler from "errorhandler";
import {Application} from "express";
import * as session from "express-session";
import * as  methodOverride from "method-override";
import * as  morgan from "morgan";
import {initialize} from "passport";
import * as path from "path";
import * as shrinkRay from "shrink-ray";
import * as swaggerUi from "swagger-ui-express";
import {Config} from "./environment";
const swaggerDocument = require(path.join(Config.root, "swagger.json"));

export function configExpress(app: Application) {
    const env = app.get("env");
    app.use(cors());
    if(env !== "test") app.use(morgan("dev"));
    app.use(shrinkRay());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser());
    app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use(initialize());

    /**
     * Lusca - express server security
     * https://github.com/krakenjs/lusca
     */
    // if (env !== "test" && !process.env.SAUCE_USERNAME) {
    //     app.use(lusca({
    //         csrf: {
    //             angular: true,
    //         },
    //         xframe: "SAMEORIGIN",
    //         hsts: {
    //             maxAge: 31536000, //1 year, in seconds
    //             includeSubDomains: true,
    //             preload: true,
    //         },
    //         xssProtection: true,
    //     }));
    // }
    //
    if (env === "development" || env === "test") {
        app.use(errorHandler()); // Error handler - has to be last
    }
}
