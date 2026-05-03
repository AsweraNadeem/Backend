const express = require("express");
const router = express.Router();
const { createAnnouncement, getAnnouncements } = require("../controllers/announcementController");
const { protect } = require("../middlewares/authMiddleware");

// GET /announcements - To show on the dashboard
router.get("/", protect, getAnnouncements);

// POST /announcements - To create a new broadcast
router.post("/", protect, createAnnouncement);

module.exports = router;
