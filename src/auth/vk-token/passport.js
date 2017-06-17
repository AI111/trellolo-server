import passport from 'passport';
const VKontakteTokenStrategy = require('passport-vkontakte-token');

//curl -i -X GET \
//"https://graph.facebook.com/v2.8/me/apprequests?access_token=EAADLzHyg18sBADyh1NCPJknpIxHr4QMkRYnrAFQqi9oZBH5KxiXhIZCjGSD2LbNvhHDrHScexn9fbtCmjsU477vWoSbfDjHav5eImKt1OxdBoZAqukKSjvhrJB2WYHFZAiZBjZAaFossXOkZCbjaTZAjIdUsRwTerS8XU2nPBDJwKUUQyr4qXpapDo6fE7DN4BkZD"
export function setup(User, config) {
  passport.use(new VKontakteTokenStrategy({
    clientID: config.vk.clientID,
    clientSecret: config.vk.clientSecret,
      // callbackURL: config.facebook.callbackURL,
    // profileFields: ['id', 'displayName', 'name', 'emails', 'gender', 'birthday']
  },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({'vkontakte.id': profile.id}).exec()
        .then(user => {
          if(user) {
            return done(null, user);
          }
          user = new User({
            name: profile.displayName,
            // email: profile.emails[0].value,
            avatar: profile.photos[0] ? profile.photos[0].value : '',
            role: 'user',
            provider: 'vkontakte',
            vkontakte: profile._json
          });
          return user.save()
            .then(savedUser => done(null, savedUser))
            .catch(err => done(err));
        })
        .catch(err => done(err));
    }));
}
