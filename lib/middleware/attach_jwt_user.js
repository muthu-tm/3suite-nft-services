'use strict';
let passport = require('passport');

let attach_jwt_user = (params) => {
    params = params || {};
    return function (req, res, next) {
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) { return next(err); }

            if (!user) {
                return next();
            }

            req.logIn(user, { session: false }, (err) => {
                if (err) { return next(err); }
                return next();
            });
        })(req, res, next);
    };
};

module.exports = attach_jwt_user;
