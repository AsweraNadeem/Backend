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
  // --- UPDATED FIELDS: Optional to prevent 500 errors ---
  date: { 
    type: String, 
    required: false // Changed to false to prevent validation crashes
  },
  startTime: { 
    type: String, 
    required: false // Changed to false to prevent validation crashes
  },
  duration: { 
    type: String, 
    default: "0h"
  },
  taskType: { 
    type: String, 
    default: "Development",
    enum: ["Development", "Design", "Meeting", "Testing", "Support", "Other"]
  },
  assignee: { 
    type: String, 
    trim: true 
  },
  attachment: {
    type: String 
  },
  // --- END UPDATED FIELDS ---
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
