const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  // Category 1: Employee Identification
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Matches your existing User model for DevOps/Employee data
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },

  // Category 2: Loan Application Details
  loanType: {
    type: String,
    enum: ['Personal', 'Home', 'Vehicle', 'Medical', 'Salary Advance'],
    required: true
  },
  requestedAmount: {
    type: Number,
    required: true
  },
  loanPurpose: {
    type: String,
    required: true
  },
  tenureMonths: {
    type: Number,
    required: true
  },
  requestedDisbursementDate: {
    type: Date,
    default: Date.now
  },
  attachments: [String], // Array of URLs for uploaded documents (e.g., from Cloudinary or AWS)

  // Category 3: Approval & Financials
  loanReferenceId: {
    type: String,
    unique: true,
    sparse: true // Allows nulls until ID is generated upon approval
  },
  sanctionedAmount: {
    type: Number
  },
  interestRate: {
    type: Number,
    default: 0 // Percentage per annum
  },
  emiAmount: {
    type: Number
  },
  approvalStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Disbursed'],
    default: 'Pending'
  },
  approverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approverRemarks: {
    type: String
  },

  // Category 4: Payroll & Repayment Tracking
  repaymentStartDate: {
    type: Date
  },
  totalAmountRecovered: {
    type: Number,
    default: 0
  },
  remainingBalance: {
    type: Number
  },
  loanStatus: {
    type: String,
    enum: ['Active', 'Closed', 'Defaulted'],
    default: 'Active'
  },
  installmentsPaid: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Pre-save middleware to initialize remainingBalance when a loan is sanctioned
loanSchema.pre('save', function(next) {
  if (this.isModified('sanctionedAmount') && !this.remainingBalance) {
    this.remainingBalance = this.sanctionedAmount;
  }
  next();
});

module.exports = mongoose.model('Loan', loanSchema);
