/**
 * Created by sasha on 6/20/17.
 */
'use strict';

import {Router} from 'express';
import {authenticate} from 'passport';
import {setTokenCookie} from '../auth.service';

const router = Router();

router
    .get('/', authenticate('github', {
        failureRedirect: '/signup',
        scope: [
            'profile',
            'email'
        ],
        session: false
    }))
    .get('/callback', authenticate('github', {
        failureRedirect: '/signup',
        session: false
    }), setTokenCookie);

export default router;
