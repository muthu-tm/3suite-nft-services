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

    static async fetch_nft_by_contract(contract) {
        let doc_snap = await this.get_col_ref().where("contract", "==", contract).get()
        if (doc_snap.empty) {
            return;
        }

        return this.Build(doc_snap.docs[0].data());
    }

    static async fetch_nft_by_creator(id, meta, status) {
        let doc_snap = await this.get_col_ref().where("creator.id", "==", id)
            .where("metadata", "==", meta)
            .where("status", "==", status).get()
        if (doc_snap.empty) {
            return;
        }

        return this.Build(doc_snap.docs[0].data());
    }

    static async fetch_nft_by_creator_id(id) {
        let doc_snap = await this.get_col_ref().where("creator.id", "==", id).get()
        if (doc_snap.empty) {
            return [];
        }

        let data = [];
        doc_snap.forEach(doc => {
            data.push(doc.data());
        });

        return data;
    }

    static async fetch_nft_by_owner_id(id) {
        let doc_snap = await this.get_col_ref().where("owner.id", "==", id).get()
        if (doc_snap.empty) {
            return [];
        }

        let data = [];
        doc_snap.forEach(doc => {
            data.push(doc.data());
        });

        return data;
    }

    // UI Get functions for DASHBOARD
    static async fetch_all_assets(startAfter, limit, sortBy, tags) {
        let doc_query;
        if (tags.length > 0) {
            doc_query = this.get_col_ref()
                .where('tags', 'array-contains-any', tags)
                .orderBy('created_at', sortBy)
        } else {
            doc_query = this.get_col_ref()
                .orderBy('created_at', sortBy)

        }

        if (startAfter) {
            var timestamp = admin.firestore.Timestamp.fromMillis(startAfter)
            doc_query = doc_query.startAfter(timestamp).limit(limit)
        } else {
            doc_query = doc_query.limit(limit)
        }

        let doc_snap = await doc_query.get();
        if (doc_snap.empty) {
            return [];
        }

        let data = [];
        doc_snap.forEach(doc => {
            data.push(doc.data());
        });

        return data;
    }


    // UI Get functions for DASHBOARD
    static async fetch_relevant_assets(startAfter, limit, sortBy, tags, asset_id) {
        let doc_query;
        if (tags.length > 0) {
            doc_query = this.get_col_ref()
                .where('tags', 'array-contains-any', tags)
                .orderBy('created_at', sortBy)
        } else {
            doc_query = this.get_col_ref()
                .orderBy('created_at', sortBy)
        }

        if (startAfter) {
            var timestamp = admin.firestore.Timestamp.fromMillis(startAfter)
            doc_query = doc_query.startAfter(timestamp).limit(limit)
        } else {
            doc_query = doc_query.limit(limit)
        }

        let doc_snap = await doc_query.get();
        if (doc_snap.empty) {
            return [];
        }

        let data = [];
        doc_snap.forEach(doc => {
            if (doc.id !== asset_id) {
                data.push(doc.data());
            }
        });

        return data;
    }

    static async fetch_top_assets(startAfter, limit, sortBy, tags) {
        let doc_query;
        if (tags.length > 0) {
            doc_query = this.get_col_ref()
                .where('tags', 'array-contains-any', tags)
                .orderBy('created_at', sortBy)
        } else {
            doc_query = this.get_col_ref()
                .orderBy('created_at', sortBy)
        }

        if (startAfter) {
            var timestamp = admin.firestore.Timestamp.fromMillis(startAfter * 1000)
            doc_query = doc_query.startAfter(timestamp).limit(limit)
        } else {
            doc_query = doc_query.limit(limit)
        }

        let doc_snap = await doc_query.get();
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
