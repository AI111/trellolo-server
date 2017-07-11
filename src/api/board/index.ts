/**
 * Created by sasha on 6/22/17.
 */
"use strict";

import {Router} from "express";
import {hasRole, isAuthenticated} from "../../auth/auth.service";
import {controller} from "./board.controller";
import {validateReauest} from "../../common/validation.service";
import {checkProject} from "../project/project.helpers";

export default function(): Router {
    const router =  Router();
    router.get("/", isAuthenticated(),checkProject,  controller.index);
    // router.delete("/:id", hasRole("admin"), controller.destroy);
    // router.get("/me", isAuthenticated(), controller.myProjects);
    // router.put("/:id/password", isAuthenticated(), controller.changePassword);
    // router.get("/:id", isAuthenticated(), controller.show);
    router.post("/",isAuthenticated(), checkProject, controller.create);
    return router;
}