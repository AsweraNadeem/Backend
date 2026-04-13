const path = require("path");
const dotenv = require("dotenv");

// Load .env first
dotenv.config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoute = require('./routes/authRoutes');
const employeRoute = require('./routes/employeRoutes');

// Initialize DB
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoute);
app.use("/employee", employeRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log("DB URI loaded:", !!process.env.MONGODB_URI);
});