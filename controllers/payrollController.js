const Payroll = require("../modals/Payroll");

// Get all payroll records
exports.getAllPayroll = async (req, res) => {
  try {
    const payroll = await Payroll.find();
    res.json(payroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create payroll
exports.createPayroll = async (req, res) => {
  const { employeeId, basicSalary, allowances, deductions, tax, netSalary } = req.body;
  try {
    const payroll = new Payroll({ employeeId, basicSalary, allowances, deductions, tax, netSalary });
    await payroll.save();
    res.status(201).json(payroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};