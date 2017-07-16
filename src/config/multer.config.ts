/**
 * Created by sasha on 6/25/17.
 */
import * as multer from "multer";
import {createHash, createHmac} from 'crypto'
const debug = require('debug')('trellolo.multer.storage');
import {Request, RequestHandler, Response} from 'express'
import {validateReauest} from "../common/validation.service";
const hmac = createHmac('md5', 'a secret');

const avatarStorage = multer.diskStorage({
    destination: function (req: Request, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req: Request, file, cb) {
        debug('file name', req.body);
        cb(null, file.fieldname + '-' + Date.now() + file.mimetype.replace(/\w*\//, '.'))
    }
});
const storage = multer.diskStorage({
    destination: function (req: Request, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req: Request, file, cb) {
        const hash =createHmac('md5', 'a secret').update(req.user._id+'', 'utf8').digest('hex');
        cb(null, file.fieldname + '-' + hash + file.mimetype.replace(/\w*\//, '.'))
    }
});
export let uploadAvatar = multer({
    storage: avatarStorage
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
export const userCreate = uploadAvatar.single("avatar");
// export const checkBeforeSave(name: string,clb:[(req:Request) => Promise<boolean>]):RequestHandler {
//     uploadAtterCheck = multer({
//         storage: storage,
//         fileFilter:(req, file, cb) =>{
//             // validateReauest(req.t)
//         }
//     });
// }