import Controller from "./Controller.js";
import { UploadFileToIPFS, UploadMetaToIPFS } from "../utils/ipfs_utils.js";
import UnauthorizedException from "../exceptions/UnauthorizedException.js";

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

            const file = request.files.file;
            let resp = await UploadFileToIPFS(file)
            await db.nft_assets.create({
                image: resp.data.Hash,  
                status: 0,   // Initial state set as asset created
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

    /**
     * Upload NFT metadata into IPFS
     * @param {*} request
     */
    async uploadMetaToIPFS(request) {
        try {
            if (!request.user) {
                return this.handleException(new UnauthorizedException())
            }

            const id = request.body.id;
            const tags = request.body.tags;

            const name = request.body.name;
            const description = request.body.description;
            const external_link = request.body.ext_link;
            const image = request.body.image;
            const properties = request.body.properties;

            let metadata = {
                name,
                description,
                external_link,
                image,
                properties
            }
            let resp = await UploadMetaToIPFS(metadata)
            await db.nft_assets.update(id, {
                metadata: resp.data.Hash,
                status: 1,   // update the status as METADATA uploaded
                tags: tags
            }, true)

            return this.sendResponse({
                status: true,
                error: {},
                data: resp.data,
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