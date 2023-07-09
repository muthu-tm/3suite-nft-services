import axios from 'axios';

import Environment from "../environment.js";
let infuraConfig = Environment.config.get("infura");
const auth = 'Basic ' + Buffer.from(infuraConfig.nft.api_key + ':' + infuraConfig.nft.api_secret).toString('base64');

/**
* searchNFT with a string param
* @link https://docs.infura.io/infura-expansion-apis/nft-api/rest-apis/api-reference/metadata#search-for-nfts-given-a-string
*/
export const searchNFT = async function (chainId, lookupValue) {
    try {
        let resp = {
            total: 0,
            network: "",
            chainId: chainId,
            nfts: []
        }

        let cursor = null;
        do {
            let resp_temp = await axios.get(infuraConfig.nft.api_url + `/networks/${chainId}/nfts/search`,
                {
                    params: { cursor: cursor, lookupValue: lookupValue }
                },
                {
                    headers: {
                        'Authorization': auth,
                    },
                }
            );

            resp.total = resp_temp.data.total
            resp.network = resp_temp.data.network
            resp.nfts.push(resp_temp.data.nfts)
            cursor = resp_temp.data.cursor
        } while (cursor !== null)

        return resp
    } catch (err) {
        throw err
    }
}

/**
* nftMetaByAddress
* @link https://docs.infura.io/infura-expansion-apis/nft-api/rest-apis/api-reference/metadata#get-nft-metadata
*/
export const nftMetaByAddress = async function (chainId, tokenAddress, tokenId) {
    try {
        const resp = await axios.get(infuraConfig.nft.api_url + `/networks/${chainId}/nfts/${tokenAddress}/tokens/${tokenId}`,
            {
                params: { resyncMetadata: true }
            },
            {
                headers: {
                    'Authorization': auth,
                },
            }
        );


        return resp
    } catch (err) {
        throw err
    }
}

/**
* nftOwnersByAddress
* @link https://docs.infura.io/infura-expansion-apis/nft-api/rest-apis/api-reference/ownership#get-nft-owners-by-contract-address
*/
export const nftOwnersByAddress = async function (chainId, tokenAddress) {
    try {
        let resp = {
            total: 0,
            network: "",
            tokenAddress: tokenAddress,
            chainId: chainId,
            owners: []
        }

        let cursor = null;
        do {
            const resp_temp = await axios.get(infuraConfig.nft.api_url + `/networks/${chainId}/nfts/${tokenAddress}/owners`,
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
            resp.owners.push(resp_temp.data.owners)
            cursor = resp_temp.data.cursor
        } while (cursor !== null)

        return resp
    } catch (err) {
        throw err
    }
}

/**
* nftOwnersByAddressID
* @link https://docs.infura.io/infura-expansion-apis/nft-api/rest-apis/api-reference/ownership#get-nft-owners-by-contract-address-and-token-id
*/
export const nftOwnersByAddressID = async function (chainId, tokenAddress, tokenId) {
    try {
        let resp = {
            total: 0,
            network: "",
            tokenAddress: tokenAddress,
            tokenId: tokenId,
            chainId: chainId,
            owners: []
        }

        let cursor = null;
        do {
            const resp_temp = await axios.get(infuraConfig.nft.api_url + `/networks/${chainId}/nfts/${tokenAddress}/${tokenId}/owners`,
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
            resp.owners.push(resp_temp.data.owners)
            cursor = resp_temp.data.cursor
        } while (cursor !== null)

        return resp
    } catch (err) {
        throw err
    }
}

/**
* transfersByAddress
* @link https://docs.infura.io/infura-expansion-apis/nft-api/rest-apis/api-reference/transfers#get-all-transfers-by-contract-address
*/
export const transfersByAddress = async function (chainId, tokenAddress) {
    try {
        let resp = {
            total: 0,
            network: "",
            tokenAddress: tokenAddress,
            chainId: chainId,
            transfers: []
        }

        let cursor = null;
        do {
            const resp_temp = await axios.get(infuraConfig.nft.api_url + `/networks/${chainId}/nfts/${tokenAddress}/transfers`,
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

/**
* transfersByAddressID
* @link https://docs.infura.io/infura-expansion-apis/nft-api/rest-apis/api-reference/transfers#get-all-transfers-for-an-nft
*/
export const transfersByAddressID = async function (chainId, tokenAddress, tokenId) {
    try {
        let resp = {
            total: 0,
            network: "",
            tokenAddress: tokenAddress,
            tokenId: tokenId,
            chainId: chainId,
            transfers: []
        }

        let cursor = null;
        do {
            const resp_temp = await axios.get(infuraConfig.nft.api_url + `/networks/${chainId}/nfts/${tokenAddress}/tokens/${tokenId}/transfers`,
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
