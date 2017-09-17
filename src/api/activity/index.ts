"use strict";

import {Router} from "express";
import {isAuthenticated} from "../../auth/auth.service";
import {controller} from "./activity.controller";

export default function(): Router {
    const router =  Router();
    router.get("/", isAuthenticated(), controller.index);
    router.get("/:id", isAuthenticated(), controller.show);
    return router;
}
