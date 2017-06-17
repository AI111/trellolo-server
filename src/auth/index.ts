'use strict';
import * as express from 'express';
import {Config as config} from '../config/environment';
import {db} from '../sqldb';
import {setup} from './local/passport'
// Passport Configuration
setup(db.User, config);
// require('./facebook/passport').setup(DBConnection.User, config);
// require('./google/passport').setup(DBConnection.User, config);
// require('./twitter/passport').setup(DBConnection.User, config);

const router = express.Router();

router.use('/local', require('./local').default);
// router.use('/facebook', require('./facebook').default);
// router.use('/twitter', require('./twitter').default);
// router.use('/google', require('./google').default);

export default router;
