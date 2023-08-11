import moment from "moment";
import passport from "passport";
import jwt from "jsonwebtoken";

import Controller from "./Controller.js";
import Environment from "./../environment.js";
let session_secret = Environment.config.get("session_secret");

import * as Schema from '../validators/validation.js';
import * as Exceptions from "../exceptions/Exceptions.js";

export default class UserAuthController extends Controller {
  constructor(response) {
    super(response);
  }

  /**
   * login user
   * @param {*} request
   */
  async verify(request) {
    try {
      const data = this.validateParams(request, Schema.verify_schema);
      let address = request.body.address;
      let chain_id = request.body.chain_id;
      let account = await db.user_wallets.fetch_wallet_by_address(address, chain_id)
      if (account.length != 0) {
        return this.sendResponse({
          status: true,
          error: {},
          data: {},
        });
      } else {
        return this.sendResponse({
          status: false,
          error: {
            status: "Address not found!"
          },
          data: {},
        });
      }
    } catch (error) {
      return this.handleException(error);
    }
  }

  /**
   * verify user_id
   * @param {*} request
   */
  async verifyUserID(request) {
    try {
      const data = this.validateParams(request, Schema.user_id_verify_schema);
      let user_id = request.body.user_id;
      let user = await db.user.fetch_user_by_user_id(user_id)
      if (account.length != 0) {
        return this.sendResponse({
          status: true,
          error: {},
          data: {},
        });
      } else {
        return this.sendResponse({
          status: false,
          error: {
            status: "UserID not found!"
          },
          data: {},
        });
      }
    } catch (error) {
      return this.handleException(error);
    }
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
  async refreshToken(request) {
    try {
      let refToken = request.body.refresh_token
      const user = await db.user.fetch_user_by_token(refToken);
      if (refToken && user) {
        let user_id = user.user_id;
        let id = user.id;
        const token = jwt.sign({ user_id: user_id, id: id }, session_secret, {
          expiresIn: 24 * 60 * 60, // 24 hours
        });

        delete user.refresh_token
        this.sendResponse({
          status: true,
          error: {},
          data: {
            auth_token: token,
            user: user,
          },
        });
      } else {
        return this.sendResponse({
          status: false,
          error: {},
          data: {},
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
      let name = request.body.name;
      let img = request.body.img || "";
      let banner = request.body.banner || "";
      let bio = request.body.bio || "";
      let user_id = request.body.user_id;
      let address = request.body.address;
      let chain_id = request.body.chain_id;
      let wallet_name = request.body.wallet_name || "Polygon";
      let type = request.body.wallet_type || "ERC20";

      let preferences = request.body.preferences || [];
      if (typeof preferences === "string") {
        preferences = JSON.parse(preferences);
      }

      let user = await db.user_wallets.fetch_wallet_by_address(address, chain_id);
      if (user.length === 0) {
        user = await db.user.create({
          name: name,
          user_id: user_id,
          bio: bio,
          preferences: preferences,
          profile: {
            img: img,
            banner: banner,
          },
          is_active: true,
          last_login_at: moment.utc().toDate(),
        });

        let wallet = await db.user_wallets.create(user.id, {
          address: address,
          chain_id: chain_id,
          name: wallet_name,
          type: type
        }, address);
      } else {
        return this.sendResponse({ code: 400, status: "User Found with the given Address" });
      }

      request.logIn(user, { session: false }, async function (err) {
        if (err) {
          return next(err);
        }

        let auth_token = await accessToken(user);
        response.status(200).json({
          status: true,
          error: {},
          data: {
            auth_token: auth_token.token,
            refresh_token: auth_token.refresh_token,
            user: user,
          },
        });
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
  let id = user.id;

  const token = jwt.sign({ user_id: user_id, id: id }, session_secret, {
    expiresIn: 24 * 60 * 60, // 2 hours
  });
  const refreshToken = jwt.sign(
    { user_id: user_id, id: id },
    session_secret,
    { expiresIn: 7 * 24 * 60 * 60 } // 2 days
  );
  const resp = {
    token: token,
    refresh_token: refreshToken,
  };

  var updateuserdetails = {};
  updateuserdetails["refresh_token"] = refreshToken;
  updateuserdetails["last_login_at"] = new Date(new Date().getTime());
  const result = await db.user.update(id, updateuserdetails, true);

  return resp;
}
