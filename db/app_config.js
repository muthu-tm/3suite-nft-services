import Joi from 'joi';

import firestore_db from '../lib/initialize_firebase_db.js';
const config_collection_ref = firestore_db.collection("nft_config");

class AppConfig {
    static get_col_ref() {
        return config_collection_ref;
    };

    static async fetch_app_config(id) {
        let app_doc_snap = await this.get_col_ref().limit(1).get()
        if (app_doc_snap.empty) {
            return;
        }

        return Object.assign(new this(), app_doc_snap.docs[0].data());
    }
}

AppConfig.schema = Joi.object({
    tags: Joi.array()
        .items(Joi.object()
            .pattern(/^/,
                Joi.object({
                    name: Joi.string()
                        .allow(''),

                    desc: Joi.string()
                        .optional()
                        .allow(''),

                    img: Joi.string()
                        .optional()
                        .allow(''),
                })
            )
        )
})

export default AppConfig;
