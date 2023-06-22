'use strict';

import User from './user.js';
import UserWallet from './user_wallets.js';
import NFTAsset from './nft_assets.js';

var db = {};

db["user"] = User;
db["user_wallets"] = UserWallet;
db["nft_assets"] = NFTAsset;

export default db;
