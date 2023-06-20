import Sequelize from "sequelize";

import Environment from "./../lib/environment.js";
import { user } from "./model/user.js";
import { user_accounts } from "./model/user_accounts.js";
let db_config = Environment.config.get("database");

var sequelize = new Sequelize(
  db_config.database,
  db_config.username,
  db_config.password,
  db_config
);

var db = {};
db["user"] = user(sequelize, Sequelize.DataTypes);
db["user_accounts"] = user_accounts(sequelize, Sequelize.DataTypes);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    // db[modelName].sync({ alter: true });
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
export default db;
