'use strict';

import User from './user.js';
import UserWallet from './user_wallets.js';
import NFTAsset from './nft_assets.js';
import AppConfig from './app_config.js';

var db = {};

db["user"] = User;
db["app_config"] = AppConfig;
db["user_wallets"] = UserWallet;
db["nft_assets"] = NFTAsset;

export default db;
