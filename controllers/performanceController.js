const Performance = require("../modals/Performance");

// Get all performance records
exports.getAllPerformance = async (req, res) => {
  try {
    const performance = await Performance.find();
    res.json(performance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create performance
exports.createPerformance = async (req, res) => {
  const { employeeId, kpi1, kpi2, kpi3, score } = req.body;
  try {
    const performance = new Performance({ employeeId, kpi1, kpi2, kpi3, score });
    await performance.save();
    res.status(201).json(performance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};