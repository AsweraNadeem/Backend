const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// 1. LOAD DOTENV BEFORE ANYTHING ELSE
// This ensures process.env.JWT_SECRET is available to your routes/controllers
dotenv.config(); 

const connectDB = require("./config/db");

// 2. IMPORT ROUTES AFTER DOTENV
const authRoute = require('./routes/authRoutes');
const employeRoute = require('./routes/employeRoutes');

// Initialize Database
connectDB();

const app = express();

// 3. MIDDLEWARE
app.use(cors({
    origin: "https://frontend-c716.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

// 4. ROUTES
app.use("/auth", authRoute);
app.use("/employee", employeRoute);

// Serving static files (Note: Vercel does not persist files in /uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => res.send("API is running..."));

// 5. VERCEL & LOCAL SERVER LOGIC
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Local Server running on port ${PORT}`));
}

// CRITICAL: Vercel needs the app exported to handle the serverless function
module.exports = app;
