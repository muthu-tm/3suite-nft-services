export default class UserAccountsQuery {
  async fetch_account_by_uid(uid) {
    let acc = await db.user_accounts.findByPk(uid);
    if (!acc) {
      return;
    }

    return acc;
  }

  async fetch_user_by_account(address, chain_id) {
    return db.user_accounts.findOne({
      where: { address: address, chain_id: chain_id },
      include: [
        {
          model: db.user,
          attributes: ["first_name", "last_name", "user_id", "uid", "profile_img"],
        },
      ],
    });
  }

}
