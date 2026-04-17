const express = require("express");
const router = express.Router();
const { getAllPayroll, createPayroll } = require("../controllers/payrollController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", protect, getAllPayroll);
router.post("/", protect, createPayroll);

module.exports = router;