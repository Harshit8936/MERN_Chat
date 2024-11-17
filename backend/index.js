import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/userRoutes.js";
import messageRoute from "./routes/messageRoutes.js"
import {app,server} from "./socket/socket.js"

dotenv.config();

const PORT = process.env.PORT || 4000;
// const app = express();

// middleware
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin:"http://localhost:3000",
    credentials:true
}
app.use(cors(corsOptions))
server.listen(PORT,()=>{
    connectDB()
    console.log(`App is running on ${PORT}`)
})

//  routes
app.use('/api/v1/user',userRoute)
app.use('/api/v1/message',messageRoute)
