import express, { Express, Request, Response, } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from './src/routes/auth';
import userRoutes from './src/routes/user';
import { erroHandler } from "./src/middleware/errorHandler";
import { auth } from 'express-openid-connect';

dotenv.config();

//defining port
const PORT: string | number = process.env.PORT || 5000;
const app: Express = express();

//sample testing
app.get("/uat/test", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server ");
});

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




const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: 'http://localhost:8000',
    clientID: '3wAO1dH9uP6lv8k2wROdfBzfK4aOjr95',
    issuerBaseURL: 'https://dev-legwfqyphpnvj7ji.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});
