const dashboard = require("../models/dashboardModel");

// ========================================
// DASHBOARD
// ========================================

exports.index = async (req, res) => {
  try {
    const { id_pegawai, tanggal_mulai, tanggal_sampai } = req.query;

    const totalPegawai = await dashboard.getTotalPegawai();

    const totalPresensi = await dashboard.getTotalPresensiHariIni();

    const totalTerlambat = await dashboard.getTotalTerlambat();

    const totalAdmin = await dashboard.getTotalAdmin();

    const pegawai = await dashboard.getPegawai();

    const presensiHariIni = await dashboard.getPresensi(
      id_pegawai || "",
      tanggal_mulai || "",
      tanggal_sampai || ""
    );

    res.render("dashboard/index", {
      title: "Dashboard",

      layout: "layouts/main",

      totalPegawai,

      totalPresensi,

      totalTerlambat,

      totalAdmin,

      pegawai,

      presensiHariIni,

      selectedId: id_pegawai || "",

      tanggalMulai: tanggal_mulai || "",

      tanggalSampai: tanggal_sampai || "",
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).send("Terjadi kesalahan pada server");
  }
};

// ========================================
// UPDATE JAM DATANG
// ========================================

exports.updatePresensi = async (req, res) => {
  try {
    const { id, jam_lama, jam_datang, status } = req.body;

    console.log("========== CONTROLLER UPDATE ==========");

    console.log("ID        :", id);
    console.log("Jam Lama  :", jam_lama);
    console.log("Jam Baru  :", jam_datang);
    console.log("Status    :", status);

    // ==================================================
    // VALIDASI
    // ==================================================

    if (!id || !jam_lama || !jam_datang || !status) {
      return res.status(400).json({
        success: false,

        message: "ID, jam lama, jam datang, dan status wajib diisi.",
      });
    }

    // ==================================================
    // VALIDASI STATUS
    // ==================================================

    const statusValid = ["Tepat Waktu", "Terlambat Toleransi", "Terlambat"];

    if (!statusValid.includes(status)) {
      return res.status(400).json({
        success: false,

        message: "Status presensi tidak valid.",
      });
    }

    // ==================================================
    // UPDATE DATABASE
    // ==================================================

    await dashboard.updatePresensi(
      id,

      jam_lama,

      jam_datang,

      status
    );

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.json({
      success: true,

      message: "Jam datang dan status berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Update Presensi Error:", error);

    // ==================================================
    // DUPLICATE
    // ==================================================

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,

        message: "Jam datang tersebut sudah digunakan oleh pegawai ini.",
      });
    }

    // ==================================================
    // DATA TIDAK DITEMUKAN
    // ==================================================

    if (error.message === "Data presensi tidak ditemukan atau sudah berubah.") {
      return res.status(404).json({
        success: false,

        message: error.message,
      });
    }

    // ==================================================
    // ERROR SERVER
    // ==================================================

    return res.status(500).json({
      success: false,

      message: "Gagal memperbarui data presensi.",
    });
  }
};
