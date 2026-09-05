const express = require("express");

const router = express.Router();

const dashboard = require("../controllers/dashboardController");

// ==================================================
// DASHBOARD
// ==================================================

router.get("/", dashboard.index);

// ==================================================
// UPDATE PRESENSI
// ==================================================

router.post("/presensi/update", dashboard.updatePresensi);

module.exports = router;
