'use strict';
import {Config as config} from '../config/environment';
import {sign} from 'jsonwebtoken';
import * as expressJwt from 'express-jwt';
const  compose  = require('composable-middleware');
import {db} from '../sqldb/index';
import {NextFunction, Response} from "express";
import {Request} from "../models/IExpress";
import {checkProjectAccessRights} from "../api/project/project.helpers";
import {ProjectAccessRights} from "../models/team/ITeam";

const validateJwt = expressJwt({
    secret: config.secrets.session
});

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
export function isAuthenticated() {
    return compose()
    // Validate jwt
        .use((req, res, next) => {
            // allow access_token to be passed through query parameter as well
            if(req.query && req.query.hasOwnProperty('access_token')) {
                req.headers.authorization = `Bearer ${req.query.access_token}`;
            }
            // IE11 forgets to set Authorization header sometimes. Pull from cookie instead.
            if(req.query && typeof req.headers.authorization === 'undefined') {
                req.headers.authorization = `Bearer ${req.cookies.token}`;
            }
            validateJwt(req, res, next);
        })
        // Attach user to request
        .use((req, res, next) => {
            db.User.find({
                where: {
                    _id: req.user._id
                }
            })
                .then(user => {
                    if(!user) {
                        return res.status(401).end();
                    }
                    req.user = user;
                    next();
                })
                .catch(err => next(err));
        });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
export function hasRole(roleRequired) {
    if(!roleRequired) {
        throw new Error('Required role needs to be set');
    }
    return compose()
        .use(isAuthenticated())
        .use(function meetsRequirements(req, res, next) {
            console.log('has role',req);
            if(config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
                return next();
            } else {
                return res.status(403).json({"message":"Forbidden"});
            }
        });
}
export function hasProjectRoles(roles?:[ProjectAccessRights]): NextFunction{
    return compose()
        .use(isAuthenticated())
        .use((req: Request,res: Response, next: NextFunction) => {
            console.log('----------------------',req.user._id);
            req.projectId = req.headers['project'] || req.params.projectId;
            if(!req.projectId) return res.status(403).json({"message":"Forbidden"});
            if(!roles) roles = ['user','admin','creator'];
            checkProjectAccessRights(req.user._id, req.projectId, roles)
                .then(() => next())
                .catch(err => res.status(403).send({"message":"Forbidden"}))
        });
}

/**
 * Returns a jwt token signed by the app secret
 */
export function signToken(id, role) {
    return sign({ _id: id, role } as object, config.secrets.session, {
        expiresIn: 60 * 60 * 5
    });
}

/**
 * Set token cookie directly for oAuth strategies
 */
export function setTokenCookie(req, res) {
    if(!req.user) {
        return res.status(404).send('It looks like you aren\'t logged in, please try again.');
    }
    var token = signToken(req.user._id, req.user.role);
    res.cookie('token', token);
    res.redirect('/');
}
