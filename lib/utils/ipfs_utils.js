import Environment from "./../environment.js";
let infuraConfig = Environment.config.get("infura");

import FormData from 'form-data';
import axios from 'axios';

const auth = 'Basic ' + Buffer.from(infuraConfig.ipfs.api_key + ':' + infuraConfig.ipfs.api_secret).toString('base64');

export const UploadFileToIPFS = async function (file, key) {
    try {
        const formData = new FormData();
        formData.append('file', file.data, path);

        let instance = axios.create({
            responseType: 'json',
        });

        const resp = await instance.post(infuraConfig.ipfs.api_url + "/api/v0/add?wrap-with-directory=true", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': auth,
            },
        });

        let data = resp.data
        data = JSON.parse("[" + data.split("}\n{").join("},{") + "]");
        return data;
    } catch (err) {
        console.log(err)
        throw err
    }
}


export const UploadMetaToIPFS = async function (path, content) {
    try {
        const formData = new FormData();
        formData.append('file', content, path);

        let instance = axios.create({
            responseType: 'json',
        });

        const resp = await instance.post(infuraConfig.ipfs.api_url + "/api/v0/add?wrap-with-directory=true", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': auth,
            },
        });

        let data = resp.data
        data = JSON.parse("[" + data.split("}\n{").join("},{") + "]");
        return data;
    } catch (err) {
        throw err
    }
}
