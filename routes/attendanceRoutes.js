const express = require('express');
const router = express.Router();
const { getAllAttendance, createAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middlewares/authMiddleware');

router.get("/", protect, getAllAttendance);
router.post("/", protect, createAttendance);

module.exports = router;