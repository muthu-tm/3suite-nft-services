import Controller from "./Controller.js";
import getPagination from "../utils/query_utils.js";

export default class UserController extends Controller {
  constructor(response) {
    super(response);
  }

  /**
   * update user profile details
   * @param {} request
   */
  async update(request) {
    try {
      console.log(request.body)
      let token = request.body.token;
      let url = request.body.url;
      let account_id = request.body.account_id;

      let name = request.body.name;
      let email = request.body.email || "";
      let location = request.body.location || "";
      let bio = request.body.bio || "";
      let img = request.body.img || "";
      let lang_pref = request.body.languages || [];

      user = await db.user.update(request.user.id, request.body, true);

      let account = await db.user_accounts.create(user.id, {
        token: token,
        account_id: account_id,
        url: url,
        img: img,
        created_at: new Date(new Date().getTime()),
      });

      return this.sendResponse({
        status: true,
        error: {},
        data: {}
      });
    } catch (error) {
      this.handleException(error);
    }
  }

  /**
     * Get an user info by id
     * @param {*} request
     */
  async getUser(request) {
    try {
      let data = await db.user.fetch_user_by_id(request.query.id)
      delete data.refresh_token

      let wallets = await db.user_wallets.get_user_wallets(request.query.id)
      if (wallets.length > 0) {
        data.address = wallets[0].address
      } else {
        data.address = ""
      }

      return this.sendResponse({
        status: true,
        error: {},
        data: data,
      });
    } catch (error) {
      this.handleException(error);
    }
  }

  /**
     * Get all users
     * @param {*} request
     */
  async getAllUsers(request) {
    try {
      let limit = getPagination(request.query)
      let startAfter = request.query.start_after
      let soryBy = request.query.created_sort || 'desc'

      let data = await db.user.fetch_all_users(startAfter, limit, soryBy)
      return this.sendResponse({
        status: true,
        error: {},
        data: data,
      });
    } catch (error) {
      this.handleException(error);
    }
  }

  /**
     * Get top active users
     * @param {*} request
     */
  async getTopUsers(request) {
    try {
      let limit = getPagination(request.query)
      let startAfter = request.query.start_after
      let soryBy = request.query.created_sort || 'desc'

      let data = await db.user.fetch_top_users(startAfter, limit, soryBy)
      return this.sendResponse({
        status: true,
        error: {},
        data: data,
      });
    } catch (error) {
      this.handleException(error);
    }
  }

  /**
     * Get user activities
     * @param {*} request
     */
  async getUserActivities(request) {
    try {
      let data = await db.nft_activities.fetch_activity_by_user(request.user.address)
      return this.sendResponse({
        status: true,
        error: {},
        data: data,
      });
    } catch (error) {
      this.handleException(error);
    }
  }

}
