const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

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

const app = express();

// 3. DYNAMIC CORS CONFIGURATION
// This allows your main domain, localhost, and ANY Vercel preview/branch link.
const allowedOrigins = [
    "https://frontend-c716.vercel.app", 
    "http://localhost:3000"
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like Postman or mobile apps)
        if (!origin) return callback(null, true);
        
        // Check if origin is in our list or is a Vercel subdomain
        const isAllowed = allowedOrigins.includes(origin) || origin.endsWith(".vercel.app");
        
        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error("CORS Policy: This origin is not allowed."));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

/** 
 * Handle Preflight requests globally
 * Required for Vercel deployments to prevent CORS handshake failures
 */
app.options("*", cors()); 

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. DATABASE CONNECTION MIDDLEWARE
// In serverless environments, we ensure the DB is connected before handling routes
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: "Database connection failed", 
            error: err.message 
        });
    }
});

// 5. ROUTE MOUNTING
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
app.get("/", (req, res) => res.status(200).send("HRM System API is running..."));

// 6. GLOBAL ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: "Internal Server Error", 
        error: err.message 
    });
});

// 7. SERVER INITIALIZATION (For Local Testing Only)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Local Server running on port ${PORT}`));
}

// Export for Vercel
module.exports = app;
