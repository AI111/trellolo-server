/**
 * Created by sasha on 6/22/17.
 */
"use strict";

import {Router} from "express";
import {hasRole, isAuthenticated} from "../../auth/auth.service";
import {controller} from "./board.controller";
import {validateReauest} from "../../common/validation.service";

export default function(): Router {
    const router =  Router();
    // router.get("/", hasRole("admin"), controller.index);
    // router.delete("/:id", hasRole("admin"), controller.destroy);
    // router.get("/me", isAuthenticated(), controller.myProjects);
    // router.put("/:id/password", isAuthenticated(), controller.changePassword);
    // router.get("/:id", isAuthenticated(), controller.show);
    // router.post("/", validateReauest(controller.createValidator), controller.create);
    return router;
}