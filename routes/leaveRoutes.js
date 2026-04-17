const express = require("express");
const router = express.Router();
const { getAllLeaves, createLeave } = require("../controllers/leaveController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", protect, getAllLeaves);
router.post("/", protect, createLeave);

module.exports = router;