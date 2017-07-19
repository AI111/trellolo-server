/**
 * Created by sasha on 6/22/17.
 */

"use strict";

import {Router} from "express";
import {hasBoardRoles, hasProjectRoles, isAuthenticated} from "../../auth/auth.service";
import {controller} from "./board.controller";
import {validateReauest} from "../../common/validation.service";
import {ProjectAccessRights as aRights} from "../../models/team/ITeam";

export default function(): Router {
    const router =  Router();
    router.get("/projects/:projectId/boards", hasProjectRoles(),  controller.index);
    // router.delete("/:id", hasRole("admin"), controller.destroy);
    // router.get("/me", hasProjectRoles(), controller.show);
    router.put("/boards/:id", hasBoardRoles(), controller.patch);
    router.get("/boards/:id", hasBoardRoles(), controller.show);
    router.post("/projects/:projectId/boards" ,hasProjectRoles(['creator','admin']), validateReauest(controller.createValidator) , controller.create);
    return router;
}