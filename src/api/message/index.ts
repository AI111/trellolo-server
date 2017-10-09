"use strict";

import {Router} from "express";
import {hasRoomAccess, isAuthenticated} from "../../auth/auth.service";
import {validateReauest} from "../../common/validation.service";
import {controller} from "./message.controller";
import {createValidator} from "./message.model";

export default function(): Router {
    const router =  Router();
    router.get("/", isAuthenticated(), controller.index);
    router.get("/:id", isAuthenticated(), controller.show);
    router.post("/", hasRoomAccess(), validateReauest(createValidator),  controller.create);
    return router;
}
