import Model from './model.js';
import Joi from 'joi';

import firestore_db from '../lib/initialize_firebase_db.js';
const user_collection_ref = firestore_db.collection("users");

function attach_common_attributes(data) {
    let _date = new Date();
    if (!data.created_at) {
        data.created_at = new Date(_date.getTime());
    }

    data.updated_at = new Date(_date.getTime());
}

class User extends Model {
    static get_col_ref() {
        return user_collection_ref;
    };

    static async afterCreateHook(user) {
        console.log("AFTER HOOK: User Create!!", user.id)
    }

    static async afterUpdateHook(user) {
        console.log("AFTER HOOK: User Create!!", user.id)
    }

    static async fetch_user_by_id(id) {
        let user = await this.get_by_id(id);
        if (!user) {
            return;
        }

        return this.Build(user);
    }

    static async fetch_user_by_user_id(user_id) {
        let user = await this.get_col_ref().where("user_id", "==", user_id).get()
        if (user.empty) {
            return [];
        }

        return this.Build(user.docs[0].data());
    }

    static async fetch_user_by_token(token) {
        let user = await this.get_col_ref().where("refresh_token", "==", token).get()
        if (user.empty) {
            return;
        }

        return this.Build(user.docs[0].data());
    }
}

User.schema = Joi.object({
    first_name: Joi.string()
        .optional(),

    last_name: Joi.string()
        .optional()
        .allow("")
        .default(""),

    user_id: Joi.string()
        .required(),

    profile: Joi.object({
        email: Joi.string()
            .optional()
            .allow('')
            .email(),

        img: Joi.string()
            .optional()
            .allow(''),

    }).unknown()
        .allow(true),

    refresh_token: Joi.string()
        .optional()
        .allow("")
        .default(""),

    last_login_at: Joi.date()
        .disallow(null),

    created_at: Joi.date()
        .disallow(null),

    updated_at: Joi.date()
        .disallow(null)
})

export default User;
