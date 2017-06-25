/**
 * Created by sasha on 6/25/17.
 */
import * as multer from "multer";
const debug = require('debug')('trellolo.multer.storage');
import {Request,Response} from 'express'

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
export const projectUpload = upload.single("icon");
export const userCreate = upload.single("avatar");