/**
 * Created by sasha on 6/22/17.
 */


"use strict";

import {Router} from "express";
import {hasBoardRoles, hasProjectRoles, isAuthenticated} from "../../auth/auth.service";
import {validateReauest} from "../../common/validation.service";
import {controller} from "./column.controller";
import {BoardColumn} from "./column.model";

export default function(): Router {
    const router =  Router();
    // router.get("/:boardId/columns", hasBoardRoles(),  controller.index);
    router.delete("/:id", isAuthenticated(), controller.destroy);
    // router.get("/me", hasProjectRoles(), controller.show);
    router.put("/:columnId", isAuthenticated(), validateReauest(BoardColumn.updateValidator), controller.updateColumn);
    // router.get("/boards/:id", hasBoardRoles(), controller.show);
    router.post("/" , hasBoardRoles(), validateReauest(BoardColumn.createValidator) , controller.create);
    return router;
}
