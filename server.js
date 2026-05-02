const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// 1. LOAD DOTENV FIRST
dotenv.config(); 

const connectDB = require("./config/db");

// 2. IMPORT ALL ROUTES
const authRoute = require('./routes/authRoutes');
const employeRoute = require('./routes/employeRoutes');
const leaveRoute = require('./routes/leaveRoutes');
const attendanceRoute = require('./routes/attendanceRoutes');
const performanceRoute = require('./routes/performanceRoutes');
const payrollRoute = require('./routes/payrollRoutes');
const taskRoute = require('./routes/taskRoutes'); // 👈 Import added here

// Initialize Database
connectDB();

const app = express();

// 3. MIDDLEWARE
app.use(cors({
    origin: ["https://frontend-c716.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// Increased limit for Base64 image strings
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. ROUTE MOUNTING
app.use("/auth", authRoute);
app.use("/employee", employeRoute);
app.use("/leave", leaveRoute);
app.use("/attendance", attendanceRoute);
app.use("/performance", performanceRoute);
app.use("/payroll", payrollRoute);
app.use("/tasks", taskRoute); // 👈 Mounting added here

// Health Check
app.get("/", (req, res) => res.send("HRM System API is running..."));

// 5. SERVER LOGIC
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Local Server running on port ${PORT}`));
}

// CRITICAL for Vercel deployment
module.exports = app;
