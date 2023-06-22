import Controller from "./Controller.js";
import { UploadFile } from "../utils/ipfs_utils.js";
import Exception from "../exceptions/Exception.js";
import UnauthorizedException from "../exceptions/UnauthorizedException.js";

export default class NFTController extends Controller {
    constructor(response) {
        super(response);
    }

    /**
     * login user
     * @param {*} request
     */
    async uploadToIPFS(request) {
        try {
            if (!request.user) {
                return this.handleException(new UnauthorizedException())
            }

            const file = request.files.file;
            let resp = await UploadFile(file)
            await db.nft_assets.create({
                image: resp.data.Hash,  
                status: 0,   // asset created
                creator: {
                    address: "",
                    id: request.user.id
                }
            })

            return this.sendResponse({
                status: true,
                error: {},
                data: resp.data,
            });
        } catch (error) {
            this.handleException(error);
        }
    }

}