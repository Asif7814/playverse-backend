import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to Mongoose");
    } catch (err) {
        console.log("Error connecting to mongoose", err);
        process.exit(1); // Exit process with failure
    }
};

export const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log("Disconnected from the database.");
        process.exit(0); // Exit process with success
    } catch (err) {
        console.log("Error disconnecting from mongoose", err);
        process.exit(1); // Exit process with failure
    }
};
