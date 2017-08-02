"use strict";

import {Router} from "express";
import {hasRole, isAuthenticated} from "../../auth/auth.service";
import {captchaMiddleware} from "../../common/captcha.service";
import {validateReauest} from "../../common/validation.service";
import { iconParse} from "../../config/multer.config";
import {controller} from "./user.controller";

const router =  Router();
router.get("/", isAuthenticated(), controller.index);
router.delete("/:id", hasRole("admin"), controller.destroy);
router.get("/me", isAuthenticated(), controller.me);
router.put("/:id/password", isAuthenticated(), controller.changePassword);
router.get("/:id", isAuthenticated(), controller.show);
router.post("/", iconParse("avatar"), captchaMiddleware,
    validateReauest(controller.createValidator), controller.create);
module.exports = router;
