const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  assetName: { type: String, required: true }, // e.g., MacBook Pro M3
  assetType: { 
    type: String, 
    enum: ['Laptop', 'Mobile', 'Monitor', 'Peripheral', 'Other'], 
    required: true 
  },
  serialNumber: { type: String, unique: true, required: true },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null 
  },
  assignmentDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Available', 'Assigned', 'Under Repair', 'Retired'], 
    default: 'Available' 
  },
  condition: { type: String, default: 'New' }
}, { timestamps: true });

module.exports = mongoose.model('Asset', assetSchema);
