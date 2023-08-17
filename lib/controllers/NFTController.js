import Controller from "./Controller.js";
import { UploadFileToIPFS, UploadMetaToIPFS } from "../utils/ipfs_utils.js";
import UnauthorizedException from "../exceptions/UnauthorizedException.js";
import getPagination from "../utils/query_utils.js";
import Environment from "./../environment.js";
import * as Schema from '../validators/validation.js';
let infuraConfig = Environment.config.get("infura");

export default class NFTController extends Controller {
    constructor(response) {
        super(response);
    }

    /**
     * Upload NFT image into IPFS
     * @param {*} request
     */
    async uploadImageToIPFS(request) {
        try {
            if (!request.user) {
                return this.handleException(new UnauthorizedException())
            }

            let gateway_url = infuraConfig.ipfs.gateway_url
            const file = request.files.file;
            const id = request.body.id;

            let resp = await UploadFileToIPFS(`/${id}/${file.name}`, file)
            // let resp = await UploadFileToIPFS(file, file.name)
            // console.log(resp)
            // await db.nft_assets.create({
            //     image: resp.data.Hash,  
            //     status: 0,   // Initial state set as asset created
            //     creator: {
            //         address: "",
            //         id: request.user.id
            //     }
            // })

            return this.sendResponse({
                status: true,
                error: {},
                data: {
                    image: `${gateway_url}/${resp[1].Hash}/${resp[0].Name}`,
                }
            });
        } catch (error) {
            this.handleException(error);
        }
    }

    /**
     * Upload NFT metadata into IPFS
     * @param {*} request
     */
    async uploadMetaToIPFS(request) {
        try {
            if (!request.user) {
                return this.handleException(new UnauthorizedException())
            }
            console.log(request.user)

            let data = this.validateParams(request, Schema.nft_schema);
            let gateway_url = infuraConfig.ipfs.gateway_url

            // nft asset id - uuid v4
            const id = request.body.id;
            const tags = request.body.tags;

            const name = request.body.name;
            const image = request.body.image;
            const token_id = request.body.token_id;
            const description = request.body.description;
            const properties = request.body.properties;

            let metadata = {
                name,
                image,
                description,
                properties
            }
            let resp = await UploadMetaToIPFS(`/${id}/${token_id}.json`, JSON.stringify(metadata))
            // let resp = [
            //     {
            //       Name: '1.json',
            //       Hash: 'QmRdeLsJo7A6ZRVeerLXRVjDP1K9up3gUZuTwB7RjBP9NW',
            //       Size: '458'
            //     },
            //     {
            //       Name: '',
            //       Hash: 'QmTj5ygSMFHLjd4Wk49bxHdsn7VxrCjjrrV5qzm2XHDuas',
            //       Size: '511'
            //     }
            //   ]
            let resp_data = await db.nft_assets.create({
                id: id,
                name: name,
                desc: description,
                image: image,
                token_id: token_id,
                metadata: `${gateway_url}/${resp[1].Hash}/`,
                status: 0,   // update the status as METADATA uploaded
                tags: tags,
                creator: {
                    address: request.user.address || "",
                    id: request.user.id,
                    name: request.user.name
                },
                owner: {
                    address: request.user.address || "",
                    id: request.user.id,
                    name: request.user.name
                },
                created_at: new Date(new Date().getTime()),
                updated_at: new Date(new Date().getTime()),
            }, id)

            return this.sendResponse({
                status: true,
                error: {},
                data: resp_data,
            });
        } catch (error) {
            this.handleException(error);
        }
    }


    /**
     * Get top NFTs data
     * @param {*} request
     */
    async getTopAssets(request) {
        try {
            let limit = getPagination(request.query)
            let startAfter = request.query.start_after
            let soryBy = request.query.created_sort || 'desc'
            let tags = request.query.tags || []

            if (typeof tags === "string") {
                tags = JSON.parse(tags);
            }

            let data = await db.nft_assets.fetch_top_assets(startAfter, limit, soryBy, tags)
            return this.sendResponse({
                status: true,
                error: {},
                data: data,
            });
        } catch (error) {
            this.handleException(error);
        }
    }

    /**
     * Get recently created NFT data
     * @param {*} request
     */
    async getAllAssets(request) {
        try {
            let limit = getPagination(request.query)
            let startAfter = request.query.start_after
            let soryBy = request.query.created_sort || 'desc'
            let tags = request.query.tags || []

            if (typeof tags === "string") {
                tags = JSON.parse(tags);
            }

            let data = await db.nft_assets.fetch_all_assets(startAfter, limit, soryBy, tags)
            return this.sendResponse({
                status: true,
                error: {},
                data: data,
            });
        } catch (error) {
            this.handleException(error);
        }
    }

    /**
     * Get Asset by uuid
     * @param {*} request
     */
    async getAsset(request) {
        try {
            let data = await db.nft_assets.fetch_nft_by_id(request.query.id)
            return this.sendResponse({
                status: true,
                error: {},
                data: data,
            });
        } catch (error) {
            this.handleException(error);
        }
    }

    /**
     * Get Asset by uuid
     * @param {*} request
     */
    async getUserCreated(request) {
        try {
            let data = await db.nft_assets.fetch_nft_by_creator_address(request.query.address)
            return this.sendResponse({
                status: true,
                error: {},
                data: data,
            });
        } catch (error) {
            this.handleException(error);
        }
    }
    /**
     * Get Asset by uuid
     * @param {*} request
     */
    async getUserOwned(request) {
        try {
            let data = await db.nft_assets.fetch_nft_by_owner_address(request.query.address)
            return this.sendResponse({
                status: true,
                error: {},
                data: data,
            });
        } catch (error) {
            this.handleException(error);
        }
    }

     /**
     * Get relevant assets 
     * @param {*} request
     */
     async getRelevantAssets(request) {
        try {
            let limit = getPagination(request.query)
            let startAfter = request.query.start_after
            let soryBy = request.query.created_sort || 'desc'
            let tags = request.query.tags || []

            if (typeof tags === "string") {
                tags = JSON.parse(tags);
            }
            let data = await db.nft_assets.fetch_relevant_assets(startAfter, limit, soryBy, tags, request.query.asset_id)
            return this.sendResponse({
                status: true,
                error: {},
                data: data,
            });
        } catch (error) {
            this.handleException(error);
        }
    }

    /**
     * Get Asset activities by uuid
     * @param {*} request
     */
    async getAssetActivities(request) {
        try {
            let data = await db.nft_activities.fetch_activity_by_contract(request.query.contract)
            return this.sendResponse({
                status: true,
                error: {},
                data: data,
            });
        } catch (error) {
            this.handleException(error);
        }
    }

    /**
     * Update minted NFT data
     * @param {*} request
     */
    async create(request) {
        try {
            if (!request.user) {
                return this.handleException(new UnauthorizedException())
            }

            const id = request.body.id;
            const creator_address = request.body.creator_address;
            const address = request.body.address;

            await db.nft_assets.update(id, {
                contract: address,
                status: 2,   // update the status as METADATA uploaded
                creator: {
                    address: creator_address,
                    id: request.user.id
                },
                owner: {
                    address: creator_address,
                    id: request.user.id,
                }
            }, true)

            let nft_data = await db.nft_assets.fetch_nft_by_id(id)
            return this.sendResponse({
                status: true,
                error: {},
                data: nft_data,
            });
        } catch (error) {
            this.handleException(error);
        }
    }

}