import Controller from "./Controller.js";
import Exception from "../exceptions/Exception.js";
import UnauthorizedException from "../exceptions/UnauthorizedException.js";

export default class AppController extends Controller {
    constructor(response) {
        super(response);
    }

    /**
     * Get App Config details
     * @param {*} request
     */
    async getConfig() {
        try {
            let app_config = await db.nft_config.fetch_nft_config()

            return this.sendResponse({
                status: true,
                error: {},
                data: app_config,
            });
        } catch (error) {
            this.handleException(error);
        }
    }

}