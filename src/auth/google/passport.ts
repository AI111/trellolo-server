/**
 * Created by sasha on 6/20/17.
 */
import {use}from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import {IConfig} from "../../models/IConfig";

export function setup(User, config?: IConfig) {
    use(new GoogleStrategy({
            clientID: config.authConfig.get('google').clientID,
            clientSecret: config.authConfig.get('google').clientSecret,
            callbackURL: config.authConfig.get('google').callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
        console.log(arguments);
            User.find({where: {'google': profile.id}})
                .then(user => {
                    if(user) {
                        return done(null, user);
                    }
                    user = User.build({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        role: 'user',
                        username: profile.emails[0].value.split('@')[0],
                        provider: 'google',
                        google: profile.id
                    });
                    console.log(user);
                    user.save()
                        .then(savedUser => done(null, savedUser))
                        .catch(err => done(err));
                })
                .catch(err => done(err));
        }));
}
