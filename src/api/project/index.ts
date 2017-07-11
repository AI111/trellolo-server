/**
 * Created by sasha on 6/22/17.
 */
"use strict";

import {Router} from "express";
import {hasRole, isAuthenticated} from "../../auth/auth.service";
import {controller} from "./project.controller";
import {projectUpload} from "../../config/multer.config"
// import {validateReauest} from "../../common/validation.service";

export default function(): Router {
    const router =  Router();
    router.get("/", isAuthenticated(), controller.show);
    router.delete("/:id", hasRole("admin"), controller.destroy);
    router.put("/:id", isAuthenticated(),projectUpload, controller.update);
    router.post("/",isAuthenticated(), projectUpload, controller.create);
    return router;
}