"use strict";

import {Router} from "express";
import {hasProjectRoles, hasRoomAccess, isAuthenticated} from "../../auth/auth.service";
import {validateReauest} from "../../common/validation.service";
import {db} from "../../sqldb/index";
import {controller} from "./room.controller";
import {createValidator} from "./room.model";

export default function(): Router {
    const router =  Router();
    router.get("/", isAuthenticated(), controller.index);
    router.get("/:roomId", hasRoomAccess(), controller.show);
    router.get("/:roomId/messages", hasRoomAccess(), controller.getRoomMessages);
    router.delete("/:roomId", hasRoomAccess(), controller.destroy);
    router.post("/", hasProjectRoles(), validateReauest(createValidator),  controller.createRoom);
    return router;
}
