const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  kpi1: { type: Number, required: true },
  kpi2: { type: Number, required: true },
  kpi3: { type: Number, required: true },
  score: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Performance", performanceSchema);