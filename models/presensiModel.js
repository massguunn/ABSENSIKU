const db = require("../config/database");

exports.countPresensi = async () => {
  const [rows] = await db.query(`
        SELECT COUNT(*) total
        FROM rekap_presensi
    `);

  return rows[0].total;
};
