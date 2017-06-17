import passport from 'passport';
const FacebookTokenStrategy = require('passport-facebook-token');

//curl -i -X GET \
//"https://graph.facebook.com/v2.8/me/apprequests?access_token=EAADLzHyg18sBADyh1NCPJknpIxHr4QMkRYnrAFQqi9oZBH5KxiXhIZCjGSD2LbNvhHDrHScexn9fbtCmjsU477vWoSbfDjHav5eImKt1OxdBoZAqukKSjvhrJB2WYHFZAiZBjZAaFossXOkZCbjaTZAjIdUsRwTerS8XU2nPBDJwKUUQyr4qXpapDo6fE7DN4BkZD"
export function setup(User, config) {
  passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
      // callbackURL: config.facebook.callbackURL,
    profileFields: ['id', 'displayName', 'name', 'emails', 'gender', 'birthday']
  },
    function(accessToken, refreshToken, profile, done) {
      return User.findOne({'facebook.id': profile.id}).exec()
        .then(user => {
          if(user) {
            return done(null, user);
          }
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            role: 'user',
            provider: 'facebook',
            avatar: profile.photos[0].value,
            facebook: profile._json
          });
          return user.save()
            .then(savedUser => done(null, savedUser))
            .catch(err => done(err));
        })
        .catch(err => done(err));
    }));
}
