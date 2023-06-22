import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import Environment from "./environment.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

let jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: Environment.config.get("session_secret"),
};

passport.use(
  new JwtStrategy(jwtOpts, async function (jwt_payload, done) {
    let user = await db.user.fetch_user_by_id(jwt_payload.id);

    if (!user) {
      return done(`Invalid user`);
    }
    user.id = jwt_payload.id;
    return done(null, user);
  })
);

passport.use(
  new LocalStrategy(
    {
      passwordField: "address",
      usernameField: "address",
    },
    function (usernameField, passwordField, done) {
      db.user_wallets
        .fetch_user_by_address(usernameField)
        .then(function (user) {
          if (!user) {
            return done(null, false, {
              message: `Given address "${usernameField}" doesn't exist!`,
            });
          }

          return done(null, user);
        })
        .catch(function (err) {
          console.log(err);
          if (err) {
            return done(err);
          }
          return done("Error!!");
        });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  let _user = await db.user.fetch_user_by_id(id);
  if (!_user) {
    return done(`Invalid user`);
  }

  done(null, _user);
});

export default passport;
