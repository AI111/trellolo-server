/**
 * Created by sasha on 6/22/17.
 */

"use strict";

import {Router} from "express";
import {hasBoardRoles, hasProjectRoles, isAuthenticated} from "../../auth/auth.service";
import {controller} from "./column.controller";

export default function(): Router {
    const router =  Router();
    router.get("/:boardId/columns", hasBoardRoles(),  controller.index);
    // router.delete("/:id", hasRole("admin"), controller.destroy);
    // router.get("/me", hasProjectRoles(), controller.show);
    router.put("/columns/:columnId", isAuthenticated(), controller.patch);
    // router.get("/boards/:id", hasBoardRoles(), controller.show);
    router.post("/columns/" ,hasBoardRoles() , controller.create);
    return router;
}