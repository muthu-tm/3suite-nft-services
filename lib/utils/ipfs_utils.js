import Environment from "./../environment.js";
let infuraConfig = Environment.config.get("infura");

import FormData from 'form-data';
import axios from 'axios';

export const UploadFile = async function (file) {
    try {
        const formData = new FormData();
        formData.append('file', file.data);

        const auth = 'Basic ' + Buffer.from(infuraConfig.ipfs.api_key + ':' + infuraConfig.ipfs.api_secret).toString('base64');
        const resp = await axios.post(infuraConfig.ipfs.api_url + "/api/v0/add", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': auth,
            },
        });

        return resp
    } catch (err) {
        throw err
    }

}