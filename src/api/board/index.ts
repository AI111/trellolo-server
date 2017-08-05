/**
 * Created by sasha on 6/22/17.
 */

"use strict";

import {Router} from "express";
import {hasBoardRoles, hasProjectRoles, isAuthenticated} from "../../auth/auth.service";
import {validateReauest} from "../../common/validation.service";
import {ProjectAccessRights as aRights} from "../../models/team/ITeam";
import {controller} from "./board.controller";

export default function(): Router {
    const router =  Router();
    // router.get("/projects/:projectId/boards", hasProjectRoles(),  controller.index);
    // router.delete("/:id", hasRole("admin"), controller.destroy);
    // router.get("/me", hasProjectRoles(), controller.show);
    router.get("/:id", hasBoardRoles(), controller.show);
    router.put("/:id", hasBoardRoles(), controller.patch);
    router.post("/" , hasProjectRoles(["creator", "admin"]),
        validateReauest(controller.createValidator) , controller.create);
    router.get("/:boardId/columns", hasBoardRoles(),  controller.getColumns);

    return router;
}
