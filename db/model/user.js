import bcrypt from "bcrypt";
import Sequelize from "sequelize";

let DEFAULT_COUNTRY_CODE = 91;

export function user(sequelize, DataTypes) {
  var User = sequelize.define(
    "user",
    {
      uid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      first_name: { type: DataTypes.STRING, allowNull: true },
      last_name: { type: DataTypes.STRING, allowNull: true },
      user_id: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      profile_img: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      refresh_token: { type: DataTypes.STRING },
      last_logged_in: DataTypes.DATE,
    },
    {
      underscored: true,
      freezeTableName: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      defaultScope: {
        attributes: {
          exclude: ["refresh_token"],
        },
      },
    }
  );

  User.associate = function (models) {
    // associations can be defined here
  };

  return User;
};
