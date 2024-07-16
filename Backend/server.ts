import express, { Express, Request, Response, Router } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from './src/routes/auth';
import userRoutes from './src/routes/user';
import { erroHandler } from "./src/middleware/errorHandler";

dotenv.config();

//defining port
const PORT: string | number = process.env.PORT || 5000;
const app: Express = express();

//sample testing
// app.get("/uat/test", (req: Request, res: Response) => {
//     res.send("Express + TypeScript Server ");
// });

app.use(express.json());

//authentication routes

app.use('/auth', authRoutes);

// user routes
app.use('/user', userRoutes);

app.use(erroHandler)

mongoose.connect(process.env.DB_URI ?? "").then(() => {
    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`)
    })
    console.log("database connected")
}).catch((err) => {
    console.log(`something is not good ${err}`)
})
