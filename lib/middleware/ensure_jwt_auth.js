'use strict';

import passport from "passport";

function ensure_jwt_auth (params) {
    params = params || {};
    
    return function (req, res, next) {
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) { return next(err); }
            if (!user) {
                res.status(403).json({ status: false, error : `Unable to proceed. Not logged in?.` });
                return;
            }

            req.logIn(user, { session: false }, (err) => {
                if (err) { return next(err); }
                return next();
            });
        })(req, res, next);
    };
};

export default ensure_jwt_auth;
