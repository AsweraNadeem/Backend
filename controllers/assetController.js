const Asset = require("../modals/Asset");

// Add a new asset to inventory
exports.addAsset = async (req, res) => {
  try {
    const newAsset = new Asset(req.body);
    await newAsset.save();
    res.status(201).json({ success: true, asset: newAsset });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Assign asset to an employee
exports.assignAsset = async (req, res) => {
  try {
    const { employeeId, condition } = req.body;
    const asset = await Asset.findByIdAndUpdate(
      req.params.id,
      { 
        assignedTo: employeeId, 
        status: 'Assigned', 
        assignmentDate: new Date(),
        condition: condition 
      },
      { new: true }
    );
    res.status(200).json({ success: true, asset });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get assets assigned to a specific employee
exports.getEmployeeAssets = async (req, res) => {
  try {
    const assets = await Asset.find({ assignedTo: req.params.employeeId });
    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
