import Controller from "./Controller.js";
import Environment from "./../environment.js";

let infuraConfig = Environment.config.get("infura");

import FormData from 'form-data';

export default class NFTController extends Controller {
    constructor(response) {
        super(response);
        this.user_accounts = new AccountsQuery();
    }


    /**
     * login user
     * @param {*} request
     */
    async uploadToIPFS(request) {
        try {
            const { file } = request.files;

            const formData = new FormData();
            formData.append('file', file.data);

            const resp = await axios.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `${infuraConfig.ipfs.api_key}:${infuraConfig.ipfs.secret}`,
                },
            });

            console.log("response.data: ", resp.data)
            // const ipfsHash = resp.data.Hash;

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