const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  // The User who created/owns the task (System reference)
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
  // --- NEW FIELDS START HERE ---
  date: { 
    type: String, // Calendar date (stored as string "YYYY-MM-DD" from frontend)
    required: true 
  },
  startTime: { 
    type: String, // Time (e.g., "14:30")
    required: true 
  },
  duration: { 
    type: String, // How much time to complete (e.g., "2h 30m")
    default: "0h"
  },
  taskType: { 
    type: String, 
    default: "Development",
    enum: ["Development", "Design", "Meeting", "Testing", "Support", "Other"]
  },
  assignee: { 
    type: String, // Name of the person assigned to the task
    trim: true 
  },
  attachment: {
    type: String // URL or path to a file (optional)
  },
  // --- NEW FIELDS END HERE ---
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
