'use strict';

import express from 'express';
import passport from 'passport';
import {signToken} from '../auth.service';
let debug = require('debug')('app:auth');

var router = express.Router();

router.get('/', passport.authenticate('twitter-token', {
    // scope: ['email', 'name','gender','birthday'],
  failureFlash: false,
  session: false}),
  function(req, res) {
    // debug('facebook-token',req,res);
    if(!req.user) {
      return res.status(404).json({message: 'Something went wrong, please try again.'});
    }
    let token = signToken(req.user._id, req.user.role);
    let user = req.user._doc;
    user.token = token;
    res.json(user);
  }
);

export default router;
