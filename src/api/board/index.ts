/**
 * Created by sasha on 6/22/17.
 */
"use strict";

import {Router} from "express";
import {hasProjectRoles, isAuthenticated} from "../../auth/auth.service";
import {controller} from "./board.controller";
import {validateReauest} from "../../common/validation.service";
import {ProjectAccessRights as aRights} from "../../models/team/ITeam";

export default function(): Router {
    const router =  Router();
    router.get("/:projectId/boards", hasProjectRoles(),  controller.index);
    // router.delete("/:id", hasRole("admin"), controller.destroy);
    // router.get("/me", isAuthenticated(), controller.myProjects);
    // router.put("/:id/password", isAuthenticated(), controller.changePassword);
    // router.get("/:id", isAuthenticated(), controller.show);
    router.post("/:projectId/boards",hasProjectRoles(['creator','admin']), controller.create);
    return router;
}