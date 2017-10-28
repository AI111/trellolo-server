import * as express from "express";
import {initRouter} from "./routes";
import {configExpress} from "./config/express";
import {expressErrorHeandler} from "./common/utils";
// Creates and configures an ExpressJS web server.
class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.express.use(expressErrorHeandler);
    }

    private middleware(): void {
        configExpress(this.express);
    }

    // Configure API endpoints.
    private routes(): void {
        initRouter(this.express);
    }
}

export default new App().express;
