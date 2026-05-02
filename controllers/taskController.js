// Updated to "modals" to match your project structure
const Task = require("../modals/Task"); 

// Get all tasks
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

// Create a task - UPDATED with new fields
exports.createTask = async (req, res) => {
  // 1. Pull all new fields from the request body
  const { 
    employeeId, 
    title, 
    description, 
    date, 
    startTime, 
    duration, 
    taskType, 
    assignee, 
    priority, 
    status 
  } = req.body;

  try {
    // 2. Map them to the new Task instance
    const task = new Task({ 
      employeeId, 
      title, 
      description, 
      date,          // Added
      startTime,     // Added
      duration,      // Added
      taskType,      // Added
      assignee,      // Added
      priority, 
      status 
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    // This will now show you specifically if 'date' or 'startTime' is missing
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
