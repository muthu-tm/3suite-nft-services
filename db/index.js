'use strict';

import User from './user.js';
import UserWallet from './user_wallets.js';

var db = {};

db["user"] = User;
db["user_wallets"] = UserWallet;

export default db;
