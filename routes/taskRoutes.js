const express = require("express");
const router = express.Router();
const { 
  getAllTasks, 
  createTask, 
  deleteTask, 
  getEmployeeTasks 
} = require("../controllers/taskController");
const { protect } = require("../middlewares/authMiddleware");

// Base path: /tasks (or whatever you mount it as in server.js)

// Get all tasks and Create a new task
router.get("/", protect, getAllTasks);
router.post("/", protect, createTask);

// Get tasks for a specific employee
router.get("/employee/:employeeId", protect, getEmployeeTasks);

// Delete a specific task by ID
router.delete("/:id", protect, deleteTask);

module.exports = router;
