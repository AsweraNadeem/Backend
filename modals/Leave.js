const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  leaveType: { type: String, required: true, enum: ["Casual", "Sick", "Annual"] },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  reason: { type: String },
  status: { type: String, default: "Pending", enum: ["Pending", "Approved", "Rejected"] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Leave", leaveSchema);