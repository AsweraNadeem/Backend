const Task = require("../models/Task");

// Get all tasks
// Note: You can add .populate("employeeId", "name email") if you want to see employee details
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tasks for a specific employee
exports.getEmployeeTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ employeeId: req.params.employeeId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a task
exports.createTask = async (req, res) => {
  const { employeeId, title, description, deadline, priority, status } = req.body;
  try {
    const task = new Task({ 
      employeeId, 
      title, 
      description, 
      deadline, 
      priority, 
      status 
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
