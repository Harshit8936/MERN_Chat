import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB is connected")
    } catch (error) {
        console.log(`${error}`)
        process.exit(0);
    }
}

export default connectDB