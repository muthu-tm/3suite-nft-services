import axios from 'axios';

import Environment from "../environment.js";
let infuraConfig = Environment.config.get("infura");
const auth = 'Basic ' + Buffer.from(infuraConfig.nft.api_key + ':' + infuraConfig.nft.api_secret).toString('base64');

/**
* collByWalletAddress
* @link https://docs.infura.io/infura-expansion-apis/nft-api/rest-apis/api-reference/collections#get-collections-by-wallet-address
*/
export const collByWalletAddress = async function (chainId, walletAddress) {
    try {
        let resp = {
            total: 0,
            network: "",
            account: walletAddress,
            chainId: chainId,
            collections: []
        }

        let cursor = null;
        do {
            let resp_temp = await axios.get(infuraConfig.nft.api_url + `/networks/${chainId}/accounts/${walletAddress}/assets/collections`,
                {
                    params: { cursor: cursor }
                },
                {
                    headers: {
                        'Authorization': auth,
                    },
                }
            );

            resp.total = resp_temp.data.total
            resp.network = resp_temp.data.network
            resp.collections.push(resp_temp.data.collections)
            cursor = resp_temp.data.cursor
        } while (cursor !== null)

        return resp
    } catch (err) {
        throw err
    }
}

/**
* nftByWalletAddress
* @link https://docs.infura.io/infura-expansion-apis/nft-api/rest-apis/api-reference/metadata#get-all-nfts-owned-by-a-given-wallet-address
*/
export const nftByWalletAddress = async function (chainId, walletAddress) {
    try {
        let resp = {
            total: 0,
            network: "",
            account: walletAddress,
            chainId: chainId,
            assets: []
        }

        let cursor = null;
        do {
            const resp_temp = await axios.get(infuraConfig.nft.api_url + `/networks/${chainId}/accounts/${walletAddress}/assets/nfts`,
                {
                    params: { cursor: cursor }
                },
                {
                    headers: {
                        'Authorization': auth,
                    },
                }
            );

            resp.total = resp_temp.data.total
            resp.network = resp_temp.data.network
            resp.assets.push(resp_temp.data.assets)
            cursor = resp_temp.data.cursor
        } while (cursor !== null)

        return resp
    } catch (err) {
        throw err
    }
}

/**
* transfersByWalletAddress
* @link https://docs.infura.io/infura-expansion-apis/nft-api/rest-apis/api-reference/transfers#get-all-transfers-by-wallet-address
*/
export const transfersByWalletAddress = async function (chainId, walletAddress) {
    try {
        let resp = {
            total: 0,
            network: "",
            account: walletAddress,
            chainId: chainId,
            transfers: []
        }

        let cursor = null;
        do {
            const resp_temp = await axios.get(infuraConfig.nft.api_url + `/networks/${chainId}/accounts/${walletAddress}/assets/transfers`,
                {
                    params: { cursor: cursor }
                },
                {
                    headers: {
                        'Authorization': auth,
                    },
                });

            resp.total = resp_temp.data.total
            resp.network = resp_temp.data.network
            resp.transfers.push(resp_temp.data.transfers)
            cursor = resp_temp.data.cursor
        } while (cursor !== null)

        return resp
    } catch (err) {
        throw err
    }
}
