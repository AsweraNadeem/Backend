const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// 1. Load Environment Variables
dotenv.config();

// 2. Initialize Database
connectDB();

const app = express();

// 3. Optimized CORS Configuration
app.use(cors({
    origin: "https://frontend-c716.vercel.app", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// 4. Import Routes
const authRoute = require('./routes/authRoutes');
const employeRoute = require('./routes/employeRoutes');

// COMMENTED OUT UNTIL FILES ARE CREATED TO PREVENT 500 ERROR
// const leaveRoute = require('./routes/leaveRoutes');
// const attendanceRoute = require('./routes/attendanceRoutes');
// const performanceRoute = require('./routes/performanceRoutes');
// const payrollRoute = require('./routes/payrollRoutes');

// 5. Define Routes
app.use("/auth", authRoute);
app.use("/employee", employeRoute);

// COMMENTED OUT UNTIL FILES ARE CREATED
// app.use("/leave", leaveRoute);
// app.use("/attendance", attendanceRoute);
// app.use("/performance", performanceRoute);
// app.use("/payroll", payrollRoute);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 6. Root Route (Useful for health checks)
app.get("/", (req, res) => {
    res.send("Employee Management Server is running successfully!");
});

// 7. Vercel Execution Logic
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running locally on port ${PORT}`);
    });
}

module.exports = app;
