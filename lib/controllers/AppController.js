import Controller from "./Controller.js";
import AWSUtil from "../utils/aws_utils.js";

export default class AppController extends Controller {
    constructor(response) {
        super(response);
        this.aws_utils = new AWSUtil();
    }

    /**
     * Get App Config details
     * @param {*} request
     */
    async getConfig() {
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
     * Get PreSigned user url
     * @param {*} request
     */
    async getPresignedUserURL(request) {
        try {
            let data = await this.aws_utils.createPresignedS3URL(`users/${request.query.address}/${request.query.key}`)

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