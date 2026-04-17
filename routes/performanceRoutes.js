const express = require("express");
const router = express.Router();
const { getAllPerformance, createPerformance } = require("../controllers/performanceController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", protect, getAllPerformance);
router.post("/", protect, createPerformance);

module.exports = router;