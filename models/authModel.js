const db = require("../config/database");

exports.findUser = async (username) => {
  const [rows] = await db.execute(
    "SELECT * FROM mlite_users WHERE username = ? LIMIT 1",
    [username]
  );

  return rows[0];
};
