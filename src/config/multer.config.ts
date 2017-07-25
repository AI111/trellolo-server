/**
 * Created by sasha on 6/25/17.
 */
import {createHmac} from "crypto";
import * as multer from "multer";
const debug = require("debug")("trellolo.multer.storage");
import {NextFunction, Response} from "express";
import {Request} from "../models/IExpress";
const  compose  = require("composable-middleware");
import {writeFile} from "fs";
import * as jdenticon from "jdenticon";
const avatarStorage = multer.diskStorage({
    destination(req: Request, file, cb) {
        cb(null, "uploads");
    },
    filename(req: Request, file, cb) {
        debug("file name", req.body);
        cb(null, file.fieldname + "-" + Date.now() + file.mimetype.replace(/\w*\//, "."));
    },
});
const storage = multer.diskStorage({
    destination(req: Request, file, cb) {
        cb(null, "uploads");
    },
    filename(req: Request, file, cb) {
        const hash = createHmac("md5", "a secret").update(req.user._id + "" + file.fieldname, "utf8").digest("hex");
        cb(null, file.fieldname + "-" + hash + file.mimetype.replace(/\w*\//, "."));
    },
});
export let uploadAvatar = multer({
    storage: avatarStorage,
});
export let upload = multer({
    storage,
});

export const projectUpload = uploadAvatar.single("icon");
// export const userCreate = uploadAvatar.single("avatar")
export function  iconParse(fieldName: string) {
  return compose()
      .use(uploadAvatar.single(fieldName))
      .use((req: Request, res: Response, next: NextFunction) => {
            if (req.file) return next();
            req.filePath = `uploads/${fieldName}-${Date.now()}.png`;
            writeFile(req.filePath,
                jdenticon.toPng((req.body.title || req.filePath), 256), (err) => {
                    next(err);
                });
        });
}
