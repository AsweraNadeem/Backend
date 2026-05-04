const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// 1. LOAD ENVIRONMENT VARIABLES
dotenv.config(); 

const connectDB = require("./config/db");

// 2. IMPORT ALL ROUTES
const authRoute = require('./routes/authRoutes');
const employeRoute = require('./routes/employeRoutes');
const leaveRoute = require('./routes/leaveRoutes');
const attendanceRoute = require('./routes/attendanceRoutes');
const performanceRoute = require('./routes/performanceRoutes');
const payrollRoute = require('./routes/payrollRoutes');
const taskRoute = require('./routes/taskRoutes');
const loanRoute = require('./routes/loanRoutes');
const assetRoute = require('./routes/assetRoutes');
const announcementRoute = require('./routes/announcementRoutes');

// Initialize Database Connection
connectDB();

const app = express();

// 3. IMPROVED MIDDLEWARE CONFIGURATION
app.use(cors({
    origin: ["https://frontend-c716.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // 👈 Added OPTIONS
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"] // 👈 Explicitly allowed headers
}));

/** 
 * Handle Preflight requests globally
 * This is a best practice for Vercel/Node deployments to stop CORS errors
 */
app.options("*", cors()); 

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. ROUTE MOUNTING
app.use("/auth", authRoute);
app.use("/employee", employeRoute);
app.use("/leave", leaveRoute);
app.use("/attendance", attendanceRoute);
app.use("/performance", performanceRoute);
app.use("/payroll", payrollRoute);
app.use("/tasks", taskRoute);
app.use("/loans", loanRoute);
app.use("/assets", assetRoute);
app.use("/announcements", announcementRoute);

// Base Health Check
app.get("/", (req, res) => res.send("HRM System API is running..."));

// 5. GLOBAL ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: "Internal Server Error", 
        error: err.message 
    });
});

// 6. SERVER INITIALIZATION
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Local Server running on port ${PORT}`));
}

module.exports = app;
