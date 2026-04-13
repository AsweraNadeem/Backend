const mongoose = require('mongoose');

// Variable to store the connection state
let isConnected = false;

const connectDB = async () => {
    // If already connected, don't create a new connection
    if (isConnected) {
        console.log("Using existing DB connection");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        
        // Update connection state
        isConnected = db.connections[0].readyState;
        console.log("DB connected!");
        
    } catch (error) {
        console.log("MongoDB connection failed!", error.message);
        // On Vercel, don't use process.exit(1) as it kills the function container
    }
};

module.exports = connectDB;