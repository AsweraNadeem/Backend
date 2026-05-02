const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  // Link to the user who owns or is assigned this task
  employeeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  deadline: { 
    type: Date 
  },
  priority: { 
    type: String, 
    required: true, 
    default: "Medium",
    enum: ["Low", "Medium", "High", "Urgent"] 
  },
  status: { 
    type: String, 
    default: "Pending", 
    enum: ["Pending", "In Progress", "Completed"] 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model("Task", taskSchema);
