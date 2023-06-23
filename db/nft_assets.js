import Model from './model.js';
import Joi from 'joi';

import firestore_db from '../lib/initialize_firebase_db.js';
const nft_collection_ref = firestore_db.collection("nft_assets");

function attach_common_attributes(data) {
    let _date = new Date();
    if (!data.created_at) {
        data.created_at = new Date(_date.getTime());
    }

    data.updated_at = new Date(_date.getTime());
}

class NFTAsset extends Model {
    static get_col_ref() {
        return nft_collection_ref;
    };

    static async afterCreateHook(nft) {
        console.log("AFTER HOOK: NFT Create!!", nft.id)
    }

    static async afterUpdateHook(nft) {
        console.log("AFTER HOOK: NFT Update!!", nft.id)
    }

    static async fetch_nft_by_id(id) {
        let nft = await this.get_by_id(id);
        if (!nft) {
            return;
        }

        return this.Build(nft);
    }

    static async fetch_nft_by_nft_id(contract) {
        let usnfter = await this.get_col_ref().where("contract", "==", nft_id).get()
        if (nft.empty) {
            return [];
        }

        return this.Build(nft.docs[0].data());
    }

    static async fetch_nft_by_address(address) {
        let doc_snap = await this.get_col_ref().where("creator.address", "==", address).get()
        if (doc_snap.empty) {
            return;
        }

        let data = [];
        for (let index = 0; index < doc_snap.docs.length; index++) {
            const doc = doc_snap.docs[index];
            let data_obj = doc.data();
            data_obj.id = doc.id
            data.push(data_obj);
        }


        return data;
    }
}

NFTAsset.schema = Joi.object({
    name: Joi.string()
        .optional(),

    metadata: Joi.string()
        .optional()
        .allow("")
        .default(""),

    image: Joi.string()
        .optional()
        .allow("")
        .default(""),

    status: Joi.number()
        .required()
        .default(0),

    tags: Joi.array()
        .items(Joi.string()
        .optional())
        .optional()
        .default([]),

    contract: Joi.string()
        .allow("")
        .optional(),

    owner: Joi.object({
        address: Joi.string()
            .optional()
            .allow(''),

        id: Joi.string()
            .optional()
            .allow(''),

    }).unknown()
        .allow(true),

    creator: Joi.object({
        address: Joi.string()
            .optional()
            .allow(''),

        id: Joi.string()
            .allow(''),
    }).unknown()
        .allow(true),

    created_at: Joi.date()
        .disallow(null),

    updated_at: Joi.date()
        .disallow(null)
})

export default NFTAsset;
