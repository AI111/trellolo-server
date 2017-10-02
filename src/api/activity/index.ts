"use strict";

import {Router} from "express";
import {hasProjectRoles} from "../../auth/auth.service";
import {controller} from "./activity.controller";
import {validateReauest} from "../../common/validation.service";
import {findValidator} from "./activity.model";

export default function(): Router {
    const router =  Router();
    router.get("/", hasProjectRoles(), controller.index);
    router.get("/:id", hasProjectRoles(), validateReauest(findValidator, "query"), controller.show);
    return router;
}
