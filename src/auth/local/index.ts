'use strict';

import {Router} from 'express';
import {authenticate} from 'passport';
import {signToken} from '../auth.service';

var router = Router();

router.post('/', function(req, res, next) {
  authenticate('local', function(err, user, info) {
    var error = err || info;
    if(error) {
      return res.status(401).json(error);
    }
    if(!user) {
      return res.status(404).json({message: 'Something went wrong, please try again.'});
    }

    var token = signToken(user._id, user.role);
    res.json({token, ... user.profile});
  })(req, res, next);
});

export default router;
