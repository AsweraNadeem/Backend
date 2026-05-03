const express = require("express");
const router = express.Router();
const { 
  applyLoan, 
  updateLoanStatus, 
  getEmployeeLoans 
} = require("../controllers/loanController");
const { protect } = require("../middlewares/authMiddleware");

// Base path: /loans

// 1. Employee: Submit a new loan application
// POST /loans/apply
router.post("/apply", protect, applyLoan);

// 2. Employee: Get all loans for a specific user (History)
// GET /loans/employee/:employeeId
router.get("/employee/:employeeId", protect, getEmployeeLoans);

// 3. Admin: Approve or Update loan status
// PUT /loans/approve/:id
router.put("/approve/:id", protect, updateLoanStatus);

module.exports = router;
