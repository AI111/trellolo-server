"use strict";

import {Router} from "express";
import {hasBoardRoles, isAuthenticated} from "../../auth/auth.service";
import {validateReauest} from "../../common/validation.service";
import {controller} from "./card.controller";
import {Card} from "./card.model";

export default function(): Router {
    const router =  Router();
    router.get("/:id", isAuthenticated(), controller.show);
    router.delete("/:id", isAuthenticated(), controller.destroy);
    // router.get("/me", hasProjectRoles(), controller.show);
    router.put("/:cardId", isAuthenticated(), validateReauest(Card.updateValidator), controller.updateCard);
    // router.get("/boards/:id", hasBoardRoles(), controller.show);
    router.post("/" , hasBoardRoles(), validateReauest(Card.createValidator), controller.create);
    return router;
}
