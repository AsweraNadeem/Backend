const Loan = require("../modals/Loan");

// 1. Employee: Submit a new loan application
exports.applyLoan = async (req, res) => {
  try {
    const { 
      employeeId, 
      employeeName, 
      loanType, 
      requestedAmount, 
      loanPurpose, 
      tenureMonths, 
      attachments 
    } = req.body;

    // Create a new application with 'Pending' status by default
    const newLoan = new Loan({
      employeeId,
      employeeName,
      loanType,
      requestedAmount,
      loanPurpose,
      tenureMonths,
      attachments
    });

    await newLoan.save();
    res.status(201).json({ 
      success: true, 
      message: "Loan application submitted successfully", 
      loan: newLoan 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Admin: Approve, Reject, or Disburse the loan
exports.updateLoanStatus = async (req, res) => {
  try {
    const { 
      sanctionedAmount, 
      interestRate, 
      approvalStatus, 
      approverId, 
      approverRemarks, 
      repaymentStartDate 
    } = req.body;

    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ message: "Loan record not found" });
    }

    // Logic for Approval: Calculate EMI and Financials
    if (approvalStatus === "Approved" || approvalStatus === "Disbursed") {
      // Calculate monthly EMI: (Principal + (Principal * Interest_Rate)) / Months
      const totalRepayable = sanctionedAmount * (1 + (interestRate / 100));
      const emi = totalRepayable / loan.tenureMonths;

      loan.sanctionedAmount = sanctionedAmount;
      loan.interestRate = interestRate;
      loan.emiAmount = emi.toFixed(2);
      loan.remainingBalance = sanctionedAmount; // Initial balance equals sanctioned amount
      loan.loanReferenceId = `LN-${Date.now()}`; // Generate unique tracking ID
    }

    loan.approvalStatus = approvalStatus;
    loan.approverId = approverId;
    loan.approverRemarks = approverRemarks;
    loan.repaymentStartDate = repaymentStartDate;

    await loan.save();
    res.status(200).json({ success: true, message: `Loan status updated to ${approvalStatus}`, loan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Employee: View their own loan history
exports.getEmployeeLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ employeeId: req.params.employeeId }).sort({ createdAt: -1 });
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
