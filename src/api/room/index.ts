"use strict";

import {Router} from "express";
import {hasProjectRoles, isAuthenticated} from "../../auth/auth.service";
import {validateReauest} from "../../common/validation.service";
import {db} from "../../sqldb/index";
import {controller} from "./room.controller";
import {createValidator} from "./room.model";

export default function(): Router {
    const router =  Router();
    router.get("/", isAuthenticated(), controller.index);
    router.get("/:id", isAuthenticated(), controller.show);
    router.post("/", hasProjectRoles(), validateReauest(createValidator),  controller.createRoom);
    return router;
}
