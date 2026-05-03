const express = require("express");
const router = express.Router();
const { addAsset, assignAsset, getEmployeeAssets } = require("../controllers/assetController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/add", protect, addAsset);
router.put("/assign/:id", protect, assignAsset);
router.get("/employee/:employeeId", protect, getEmployeeAssets);

module.exports = router;
