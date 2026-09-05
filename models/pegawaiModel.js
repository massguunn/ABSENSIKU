const db = require("../config/database");

exports.countPegawai = async () => {
  const [rows] = await db.query(`
        SELECT COUNT(*) total
        FROM pegawai
    `);

  return rows[0].total;
};
