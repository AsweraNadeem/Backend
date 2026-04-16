const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// 1. CALL DOTENV FIRST
dotenv.config(); 

const connectDB = require("./config/db");

// 2. NOW IMPORT ROUTES (They will now see the variables)
const authRoute = require('./routes/authRoutes');
const employeRoute = require('./routes/employeRoutes');

// Initialize DB
connectDB();

const app = express();

// 3. Middlewares
app.use(cors({
    origin: "https://frontend-c716.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

// 4. Routes
app.use("/auth", authRoute);
app.use("/employee", employeRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => res.send("API is running..."));

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;
