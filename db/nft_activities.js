import Model from './model.js';
import Joi from 'joi';

import firestore_db from '../lib/initialize_firebase_db.js';
const nft_collection_ref = firestore_db.collection("nft_activities");

function attach_common_attributes(data) {
    let _date = new Date();
    if (!data.created_at) {
        data.created_at = new Date(_date.getTime());
    }

    data.updated_at = new Date(_date.getTime());
}

class NFTActivity extends Model {
    static get_col_ref() {
        return nft_collection_ref;
    };

    static async afterCreateHook(nft) {
        console.log("AFTER HOOK: NFT Activity Create!!", nft.id)
    }

    static async afterUpdateHook(nft) {
        console.log("AFTER HOOK: NFT Activity Update!!", nft.id)
    }

    static async fetch_activity_by_id(id) {
        let nft = await this.get_by_id(id);
        if (!nft) {
            return;
        }

        return this.Build(nft);
    }

    static async fetch_activity_by_contract(contract) {
        let doc_snap = await this.get_col_ref().where("data.contract", "==", contract).orderBy('created_at', 'desc').get()
        if (doc_snap.empty) {
            return [];
        }

        let data = [];
        doc_snap.forEach(doc => {
            data.push(doc.data());
        });

        return data;
    }

    static async fetch_activity_by_user(address) {
        let doc_snap = await this.get_col_ref().where("user.address", "==", address).orderBy('created_at', 'desc').get()
        if (doc_snap.empty) {
            return [];
        }

        let data = [];
        doc_snap.forEach(doc => {
            data.push(doc.data());
        });

        return data;
    }

}

NFTActivity.schema = Joi.object({
    type: Joi.number()
        .required(),

    transaction_hash: Joi.string()
        .allow("")
        .optional(),

    // activity data
    data: Joi.object().unknown()
        .allow(true),

    // activity creator details
    user: Joi.object({
        address: Joi.string()
            .optional()
            .allow(''),

        name: Joi.string()
            .optional()
            .allow(''),
    }).unknown()
        .allow(true),

    created_at: Joi.date()
        .disallow(null)
})

export default NFTActivity;
