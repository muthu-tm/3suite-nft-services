import Controller from "./Controller.js";
import Environment from "./../environment.js";

let infuraConfig = Environment.config.get("infura");

import FormData from 'form-data';
import axios from 'axios';

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
            const file  = request.files.file;
            const formData = new FormData();
            formData.append('file', file.data);

            const auth = 'Basic ' + Buffer.from(infuraConfig.ipfs.api_key + ':' + infuraConfig.ipfs.api_secret).toString('base64');
            const resp = await axios.post(infuraConfig.ipfs.api_url + "/api/v0/add", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': auth,
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