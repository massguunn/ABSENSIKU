const db = require("../config/database");

// ========================================
// TOTAL PEGAWAI
// ========================================

exports.getTotalPegawai = async () => {
  const [rows] = await db.query("SELECT COUNT(*) AS total FROM pegawai");

  return rows[0].total;
};

// ========================================
// TOTAL ADMIN
// ========================================

exports.getTotalAdmin = async () => {
  const [rows] = await db.query(
    "SELECT COUNT(*) AS total FROM mlite_users WHERE role = 'admin'"
  );

  return rows[0].total;
};

// ========================================
// TOTAL PRESENSI HARI INI
// ========================================

exports.getTotalPresensiHariIni = async () => {
  const [rows] = await db.query(
    "SELECT COUNT(*) AS total " +
      "FROM rekap_presensi " +
      "WHERE DATE(jam_datang) = CURDATE()"
  );

  return rows[0].total;
};

// ========================================
// TOTAL TERLAMBAT HARI INI
// ========================================

exports.getTotalTerlambat = async () => {
  const [rows] = await db.query(
    "SELECT COUNT(*) AS total " +
      "FROM rekap_presensi " +
      "WHERE DATE(jam_datang) = CURDATE() " +
      "AND status LIKE 'Terlambat%'"
  );

  return rows[0].total;
};

// ========================================
// DAFTAR PEGAWAI
// ========================================

exports.getPegawai = async () => {
  const [rows] = await db.query(
    "SELECT id AS id_pegawai, nama " + "FROM pegawai " + "ORDER BY nama ASC"
  );

  return rows;
};

// ========================================
// DATA PRESENSI + FILTER
// ========================================

exports.getPresensi = async (
  id_pegawai = "",
  tanggal_mulai = "",
  tanggal_sampai = ""
) => {
  let sql =
    "SELECT " +
    "rekap_presensi.id AS id_presensi, " +
    "pegawai.id AS id_pegawai, " +
    "pegawai.nama, " +
    "pegawai.departemen, " +
    "rekap_presensi.shift, " +
    "DATE(rekap_presensi.jam_datang) AS tanggal, " +
    "DATE_FORMAT(rekap_presensi.jam_datang, '%Y-%m-%d %H:%i:%s') AS jam_datang, " +
    "DATE_FORMAT(rekap_presensi.jam_pulang, '%Y-%m-%d %H:%i:%s') AS jam_pulang, " +
    "rekap_presensi.status, " +
    "rekap_presensi.keterlambatan, " +
    "rekap_presensi.durasi, " +
    "rekap_presensi.keterangan " +
    "FROM rekap_presensi " +
    "JOIN pegawai ON pegawai.id = rekap_presensi.id " +
    "WHERE 1 = 1";

  const params = [];

  // ========================================
  // FILTER ID PEGAWAI
  // ========================================

  if (id_pegawai) {
    sql += " AND pegawai.id = ?";

    params.push(id_pegawai);
  }

  // ========================================
  // FILTER TANGGAL MULAI
  // ========================================

  if (tanggal_mulai) {
    sql += " AND DATE(rekap_presensi.jam_datang) >= ?";

    params.push(tanggal_mulai);
  }

  // ========================================
  // FILTER TANGGAL SAMPAI
  // ========================================

  if (tanggal_sampai) {
    sql += " AND DATE(rekap_presensi.jam_datang) <= ?";

    params.push(tanggal_sampai);
  }

  // ========================================
  // DEFAULT HARI INI
  // ========================================

  if (!tanggal_mulai && !tanggal_sampai) {
    sql += " AND DATE(rekap_presensi.jam_datang) = CURDATE()";
  }

  // ========================================
  // URUTKAN DATA
  // ========================================

  sql += " ORDER BY rekap_presensi.jam_datang DESC LIMIT 500";

  // ========================================
  // EKSEKUSI QUERY
  // ========================================

  const [rows] = await db.query(sql, params);

  return rows;
};

// ========================================
// UPDATE JAM DATANG
// ========================================

exports.updatePresensi = async (id, jam_lama, jam_datang, status) => {
  console.log("========== UPDATE PRESENSI ==========");
  console.log("ID        :", id);
  console.log("Jam Lama  :", jam_lama);
  console.log("Jam Baru  :", jam_datang);
  console.log("Status    :", status);

  try {
    const [result] = await db.query(
      `
      UPDATE rekap_presensi
      SET
        jam_datang = ?,
        status = ?
      WHERE
        id = ?
        AND jam_datang = ?
      `,
      [jam_datang, status, id, jam_lama]
    );

    console.log("Affected Rows:", result.affectedRows);

    if (result.affectedRows === 0) {
      throw new Error("Data presensi tidak ditemukan atau sudah berubah.");
    }

    return result;
  } catch (error) {
    // Jika jam baru sudah digunakan
    if (error.code === "ER_DUP_ENTRY") {
      const duplicateError = new Error(
        "Jam datang tersebut sudah digunakan oleh pegawai ini."
      );

      duplicateError.code = "ER_DUP_ENTRY";

      throw duplicateError;
    }

    throw error;
  }
};
