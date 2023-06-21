export function user_accounts(sequelize, DataTypes) {
  var UserAccounts = sequelize.define(
    "user_accounts",
    {
      uid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      address: { type: DataTypes.STRING, allowNull: false },
      chain_id: { type: DataTypes.INTEGER, allowNull: true },
      name: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      type: {
        type: DataTypes.STRING,
        defaultValue: "",
      }
    },
    {
      underscored: true,
      freezeTableName: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );

  UserAccounts.associate = function (models) {
    // associations can be defined here
  };

  return UserAccounts;
};
