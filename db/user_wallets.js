import firestore_db from '../lib/initialize_firebase_db.js';
import Joi from 'joi';
const user_collection_ref = firestore_db.collection("users");

class UserWallet {
    static get_col_ref(user_id) {
        return user_collection_ref.doc(user_id).collection("user_wallets")
    };

    static async create(user_id, data, id) {
        await this.schema.validateAsync(data);
        if (id) {
            await this.get_col_ref(user_id).doc(id).create(data);
        } else {
            await this.get_col_ref(user_id).doc().create(data);
        }

        return data;
    }

    static async fetch_wallet_by_id(user_id, id) {
        let wallet = await this.get_col_ref(user_id).doc(id).get()
        if (!wallet.exists) {
            return;
        }

        return wallet.data();
    }

    static async fetch_wallet_by_address(address, chain_id) {
        let doc_snap = await firestore_db.collectionGroup("user_wallets").where("address", "==", address)
            .where("chain_id", "==", chain_id).get()
        if (doc_snap.empty) {
            return [];
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

    static async fetch_user_by_address(address) {
        let doc_snap = await firestore_db.collectionGroup("user_wallets").where("address", "==", address).get()
        if (doc_snap.empty) {
            return;
        }

        if (doc_snap.docs[0].ref.parent.parent) {
            let data = await doc_snap.docs[0].ref.parent.parent.get()
            return data.data();
        } else {
            return;
        }
    }

    static async get_user_wallets(userID) {
        try {
            const doc_snap = await this.get_col_ref(userID).orderBy("created_at", "desc").get();
            if (doc_snap.empty) {
                return [];
            }

            let data = [];
            for (let index = 0; index < doc_snap.docs.length; index++) {
                const doc = doc_snap.docs[index];
                let data_obj = doc.data();
                data_obj.id = doc.id
                data.push(data_obj);
            }

            return data;
        } catch (err) {
            console.log("Error while retrieving user wallets data ", err)
            throw err
        }
    }
}

UserWallet.schema = Joi.object({
    address: Joi.string()
        .required(),

    chain_id: Joi.number()
        .required(),

    // Metamask, Coinbase, Trustwallet, etc
    name: Joi.string(),

    // ERC20, Tezos, Solana, etc
    type: Joi.string()
        .optional(),

    created_at: Joi.date()
        .disallow(null)
})

export default UserWallet;
