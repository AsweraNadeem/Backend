const mongoose = require('mongoose');

// Variable to store the connection state
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log("Using existing DB connection");
        return;
    }

    const primaryUri = process.env.MONGO_URI;
    const fallbackUri = "mongodb://127.0.0.1:27017/EmployeeManagement";
    const uri = primaryUri || fallbackUri;

    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
    };

    try {
        const db = await mongoose.connect(uri, options);
        isConnected = db.connections[0].readyState;
        console.log(`DB connected to ${uri}`);
    } catch (error) {
        console.error("MongoDB connection failed!", error.message);

        if (uri !== fallbackUri) {
            try {
                console.log("Attempting local MongoDB fallback...");
                const db = await mongoose.connect(fallbackUri, options);
                isConnected = db.connections[0].readyState;
                console.log(`DB connected to fallback ${fallbackUri}`);
                return;
            } catch (fallbackError) {
                console.error("Local MongoDB fallback failed!", fallbackError.message);
            }
        }
    }
};

module.exports = connectDB;