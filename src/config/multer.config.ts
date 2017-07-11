/**
 * Created by sasha on 6/25/17.
 */
import * as multer from "multer";
const debug = require('debug')('trellolo.multer.storage');
import {Request, RequestHandler, Response} from 'express'
import {validateReauest} from "../common/validation.service";

const storage = multer.diskStorage({
    destination: function (req: Request, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req: Request, file, cb) {
        debug('file name', req.body);
        cb(null, file.fieldname + '-' + Date.now() + file.mimetype.replace(/\w*\//, '.'))
    }
});
export let upload = multer({
    storage: storage
});
// let uploadAtterCheck = multer({
//     storage: storage,
//     fileFilter:(req, file, cb) =>{
//         // validateReauest(req.t)
//     }
// });
export const projectUpload = upload.single("icon");
export const userCreate = upload.single("avatar");
// export const checkBeforeSave(name: string,clb:[(req:Request) => Promise<boolean>]):RequestHandler {
//     uploadAtterCheck = multer({
//         storage: storage,
//         fileFilter:(req, file, cb) =>{
//             // validateReauest(req.t)
//         }
//     });
// }