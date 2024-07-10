import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();


//to create express application and use its module in using app
const app: Express = express();

//defining port
const PORT: string | number = process.env.PORT || 5000;


//sample testing
app.get("/uat/test", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server ");
});

mongoose.connect(process.env.DB_URI ?? "").then(() => {
    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`)
    })
    console.log("database connected")
}).catch((err) => {
    console.log(`something is not good ${err}`)
})
