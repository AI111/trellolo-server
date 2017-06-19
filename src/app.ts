import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import {initRouter} from "./routes";
import {configExpress} from "./config/express";
// Creates and configures an ExpressJS web server.
class App {

    // ref to Express instance
    public express: express.Application;

    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }

    // Configure Express middleware.
    private middleware(): void {
        configExpress(this.express);
    }

    // Configure API endpoints.
    private routes(): void {
        /* This is just to get up and running, and to make sure what we've got is
         * working so far. This function will change when we start to add more
         * API endpoints */
        initRouter(this.express);

    }

}

export default new App().express;
