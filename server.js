const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Import Routes
const authRoute = require('./routes/authRoutes');
const employeRoute = require('./routes/employeRoutes');

// Initialize
dotenv.config();
connectDB();

const app = express();

// 1. Better CORS (Trust your Vercel Frontend)
app.use(cors({
    origin: "https://frontend-c716.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

// 2. Routes
app.use("/auth", authRoute);
app.use("/employee", employeRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => res.send("API is running..."));

// 3. Vercel Compatibility
// Only run app.listen if we are NOT on Vercel (local development)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app; // This is required for Vercel to see your app
