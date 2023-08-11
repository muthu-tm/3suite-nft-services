import Controller from "./Controller.js";

export default class SearchController extends Controller {
    constructor(response) {
        super(response);
    }

    /**
     * Get All details
     * @param {*} request
     */
    async getAllInfo() {
        try {
            let app_config = await db.app_config.fetch_app_config()

            return this.sendResponse({
                status: true,
                error: {},
                data: app_config,
            });
        } catch (error) {
            this.handleException(error);
        }
    }

    /**
     * Get Account details
     * @param {*} request
     */
    async getAccountInfo() {
        try {
            let app_config = await db.app_config.fetch_app_config()

            return this.sendResponse({
                status: true,
                error: {},
                data: app_config,
            });
        } catch (error) {
            this.handleException(error);
        }
    }

    /**
     * Get Contrct details
     * @param {*} request
     */
    async getContractInfo() {
        try {
            let app_config = await db.app_config.fetch_app_config()

            return this.sendResponse({
                status: true,
                error: {},
                data: app_config,
            });
        } catch (error) {
            this.handleException(error);
        }
    }

    /**
     * Get All details
     * @param {*} request
     */
    async getNFTInfo() {
        try {
            let app_config = await db.app_config.fetch_app_config()

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