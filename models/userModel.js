const db = require("../config/database");

exports.countAdmin = async () => {
  const [rows] = await db.query(`
        SELECT COUNT(*) total
        FROM mlite_users
        WHERE role='admin'
    `);

  return rows[0].total;
};
