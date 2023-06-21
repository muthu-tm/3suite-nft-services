export default class UserQuery {
  async fetch_user_by_uid(uid) {
    let user = await db.user.findByPk(uid);
    if (!user) {
      return;
    }

    return user;
  }

}
