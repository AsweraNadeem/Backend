const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, "Title is required"], 
    trim: true 
  },
  message: { 
    type: String, 
    required: [true, "Message content is required"] 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'], 
    default: 'Medium' 
  },
  author: { 
    type: String, 
    default: "System Admin" 
  },
  expiresAt: { 
    type: Date // Optional: Auto-hide old announcements
  }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
