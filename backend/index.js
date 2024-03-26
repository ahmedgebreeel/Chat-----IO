import  express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";
import connectToMongoDB from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

app.use(express.json()); // to parse incoming requests with Json payloads (from req.body)  


app.use("/api/auth", authRoutes)


app.get('/', (req, res) => {
    res.send("welcome to my sever");
})





app.listen(PORT, ()=>{
    connectToMongoDB();
    console.log(`server running on port ${PORT}`);})