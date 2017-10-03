"use strict";

import {Router} from "express";
import {hasProjectRoles} from "../../auth/auth.service";
import {controller} from "./activity.controller";
import {validateReauest} from "../../common/validation.service";
import {findValidator} from "./activity.model";

export default function(): Router {
    const router =  Router();
    router.get("/", hasProjectRoles(), validateReauest(findValidator, "query"),  controller.index);
    router.get("/:id", hasProjectRoles(),  controller.show);
    return router;
}
