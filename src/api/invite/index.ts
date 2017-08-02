"use strict";

import {Router} from "express";
import {hasBoardRoles, hasProjectRoles, isAuthenticated} from "../../auth/auth.service";
import {controller} from "./invite.controller";
import {validateReauest} from "../../common/validation.service";

export default function(): Router {
    const router =  Router();
    // router.get("/", hasProjectRoles(), hasBoardRoles(),  controller.index);
    // router.delete("/:id", hasRole("admin"), controller.destroy);
    //
    // router.put("/columns/:columnId", isAuthenticated(), controller.patch);
    router.get("/", isAuthenticated(), controller.index);
    router.post("/", hasProjectRoles(["admin", "creator"]) ,  validateReauest(controller.createValidator), controller.create);
    router.delete("/:id", isAuthenticated(), controller.destroy);
    router.post("/:id/accept", isAuthenticated(), controller.accept);
    return router;
}
