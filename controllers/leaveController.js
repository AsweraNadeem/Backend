const Leave = require("../modals/Leave");

// Get all leaves
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find();
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a leave
exports.createLeave = async (req, res) => {
  const { employeeId, leaveType, fromDate, toDate, reason } = req.body;
  try {
    const leave = new Leave({ employeeId, leaveType, fromDate, toDate, reason });
    await leave.save();
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};