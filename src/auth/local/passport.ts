import * as passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {IConfig} from "../../models/IConfig";
import {Sequelize} from "sequelize";

function localAuthenticate(User, email, password, done) {
 return User.find({
    where: {
      email: email.toLowerCase()
    }
  })
    .then(user => {
      if(!user) {
        return done(null, false, {
          message: 'This email is not registered.'
        });
      }
      user.authenticate(password).then(authenticated => {
        if(!authenticated) {
          return done(null, false, { message: 'This password is not correct.' });
        } else {
          return done(null, user);
        }
      });
    })
    .catch(err => done(err));
}

export function setup(User, config?: IConfig) {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  }, function(email, password, done) {
    return localAuthenticate(User, email, password, done);
  }));
}
