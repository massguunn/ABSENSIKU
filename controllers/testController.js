const db = require("../config/database");

exports.test = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT COUNT(*) as total FROM pegawai");

    res.json(rows);
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
};
