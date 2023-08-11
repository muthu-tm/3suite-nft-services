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

    static async fetch_top_users(startAfter, limit, soryBy) {
        let doc_snap = this.get_col_ref()
            .where("is_active", "==", true)
            .orderBy('created_at', soryBy)

        if (startAfter) {
            var timestamp = admin.firestore.Timestamp.fromMillis(startAfter * 1000)
            doc_snap = doc_snap.startAfter(timestamp).limit(limit)
        } else {
            doc_snap = doc_snap.limit(limit)
        }

        doc_snap = await doc_snap.get()
        if (doc_snap.empty) {
            return [];
        }

        let data = [];
        doc_snap.forEach(doc => {
            data.push(doc.data());
        });

        return data;
    }

    static async fetch_all_users(startAfter, limit, soryBy) {
        let doc_snap = this.get_col_ref()
            .where("is_active", "==", true)
            .orderBy('created_at', soryBy)

        if (startAfter) {
            var timestamp = admin.firestore.Timestamp.fromMillis(startAfter * 1000)
            doc_snap = doc_snap.startAfter(timestamp).limit(limit)
        } else {
            doc_snap = doc_snap.limit(limit)
        }

        doc_snap = await doc_snap.get()
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

User.schema = Joi.object({
    name: Joi.string()
        .optional(),

    user_id: Joi.string()
        .required(),

    bio: Joi.string()
        .optional()
        .allow(''),

    preferences: Joi.array()
        .items(Joi.string()
            .optional())
        .optional()
        .default([]),

    profile: Joi.object({
        email: Joi.string()
            .optional()
            .allow('')
            .email(),

        img: Joi.string()
            .optional()
            .allow(''),

        banner: Joi.string()
            .optional()
            .allow(''),

    }).unknown()
        .allow(true),

    is_active: Joi.boolean()
        .default(true),

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
