const path = require("path");
const dotenv = require("dotenv");

// Load .env
dotenv.config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoute = require('./routes/authRoutes');
const employeRoute = require('./routes/employeRoutes');

// Initialize DB
connectDB();

const app = express();

// Enable CORS for all origins (Standard for initial deployment)
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoute);
app.use("/employee", employeRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root route to prevent 404
app.get("/", (req, res) => {
    res.send("Employee Management Server is running successfully!");
});

// ONLY run app.listen if NOT on Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

// REQUIRED for Vercel
module.exports = app;