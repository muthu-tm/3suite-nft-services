import moment from "moment";
import passport from "passport";
import jwt from "jsonwebtoken";

import Controller from "./Controller.js";
import Environment from "./../environment.js";
let session_secret = Environment.config.get("session_secret");

import * as Schema from '../validators/validation.js';

export default class UserController extends Controller {
  constructor(response) {
    super(response);
  }

  /**
   * login user
   * @param {*} request
   */
  async login(request, next) {
    try {
      const data = this.validateParams(request, Schema.login_schema);
      passport.authenticate(
        "local",
        { session: false },
        async (err, user, info) => {
          if (err) {
            return next(err);
          }

          if (!user) {
            return this.response
              .status(403)
              .json({ status: false, error: info.message, data: null });
          }

          request.logIn(user, { session: false }, async (err) => {
            if (err) {
              return next(err);
            }
            let auth_token = await accessToken(request.user);

            this.sendResponse({
              status: true,
              error: {},
              data: {
                auth_token: auth_token.token,
                refresh_token: auth_token.refresh_token,
                user: user,
              },
            });
          });
        }
      )(request, this.response, next);
    } catch (error) {
      this.handleException(error);
    }
  }

  /**
   * login user
   * @param {*} request
   */
  async refreshToken(refToken) {
    try {
      const user = await db.user.findOne({
        where: { refresh_token: refToken },
      });

      if (refToken && user) {
        let user_id = user.user_id;
        let uid = user.uid;
        const token = jwt.sign({ user_id: user_id, uid: uid }, session_secret, {
          expiresIn: 24 * 60 * 60, // 24 hours
        });

        this.sendResponse({
          status: true,
          error: {},
          data: {
            auth_token: token,
            user: user,
          },
        });
      }
    } catch (error) {
      this.handleException(error);
    }
  }

  /**
   * register new user
   * @param {} request
   */
  async register(request, response, next) {
    try {
      const data = this.validateParams(request, Schema.register_schema);
      let fname = request.body.fname;
      let lname = request.body.lname;
      let user_id = request.body.user_id;
      let profile_img = "";

      let user = await db.user.findOne({ where: { contact_no: contact_no } });
      if (user === null) {
        user = await db.user.create({
          first_name: fname,
          last_name: lname,
          user_id: user_id,
          profile_img: profile_img,
          last_logged_in: moment.utc().toDate(),
        });
      } else {
        this.sendResponse({ code: 400, status: "User Found with the Contact Number" });
      }

      request.logIn(user, { session: false }, async function (err) {
        if (err) {
          return next(err);
        }

        let auth_token = await accessToken(user);
        delete user.uid;
        response.status(200).json({
          status: true,
          error: {},
          data: {
            auth_token: auth_token.token,
            refresh_token: auth_token.refresh_token,
            user: user,
          },
        });
        return
      });
    } catch (error) {
      this.handleException(error);
    }
  }

}

async function accessToken(user) {
  if (!user) {
    throw "user isn't suppiled...";
  }
  let user_id = user.user_id;
  let uid = user.uid;

  const token = jwt.sign({ user_id: user_id, uid: uid }, session_secret, {
    expiresIn: 24 * 60 * 60, // 2 hours
  });
  const refreshToken = jwt.sign(
    { user_id: user_id, uid: uid },
    session_secret,
    { expiresIn: 7 * 24 * 60 * 60 } // 2 days
  );
  const resp = {
    token: token,
    refresh_token: refreshToken,
  };

  var updateuserdetails = {};
  updateuserdetails["refresh_token"] = refreshToken;
  const result = await db.user.update(updateuserdetails, {
    where: { uid: user.uid },
  });

  return resp;
}
