"use strict";

import {Router} from "express";
import {hasRole, isAuthenticated} from "../../auth/auth.service";
import {controller} from "./user.controller";

export default function(): Router {
    const router =  Router();
    router.get("/", hasRole("admin"), controller.index);
    router.delete("/:id", hasRole("admin"), controller.destroy);
    router.get("/me", isAuthenticated(), controller.me);
    router.put("/:id/password", isAuthenticated(), controller.changePassword);
    router.get("/:id", isAuthenticated(), controller.show);
    router.post("/", controller.create);
    return router;
}
