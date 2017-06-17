import passport from 'passport';
const TwitterTokenStrategy = require('passport-twitter-token');

//curl -i -X GET \
//"https://graph.facebook.com/v2.8/me/apprequests?access_token=EAADLzHyg18sBADyh1NCPJknpIxHr4QMkRYnrAFQqi9oZBH5KxiXhIZCjGSD2LbNvhHDrHScexn9fbtCmjsU477vWoSbfDjHav5eImKt1OxdBoZAqukKSjvhrJB2WYHFZAiZBjZAaFossXOkZCbjaTZAjIdUsRwTerS8XU2nPBDJwKUUQyr4qXpapDo6fE7DN4BkZD"
export function setup(User, config) {
  passport.use(new TwitterTokenStrategy({
    consumerKey: config.twitter.clientID,
    consumerSecret: config.twitter.clientSecret,
      // callbackURL: config.facebook.callbackURL,
      // profileFields: ['id', 'displayName', 'name', 'emails', 'gender', 'birthday']
  },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({'twitter.id_str': profile.id}).exec()
        .then(user => {
          if(user) {
            return done(null, user);
          }
          user = new User({
            name: profile.displayName,
            username: profile.username,
            role: 'user',
            avatar: profile.photos[0].value,
            provider: 'twitter',
            twitter: profile._json
          });
          return user.save()
            .then(savedUser => done(null, savedUser))
            .catch(err => done(err));
        })
        .catch(err => done(err));
    }));
}
