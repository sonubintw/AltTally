import express, { Express, Request, Response, } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from './src/routes/auth';
import userRoutes from './src/routes/user';
import { erroHandler } from "./src/middleware/errorHandler";
import { auth } from 'express-openid-connect';
import path from "path";

import expressSession from "express-session";
import passport, { Profile } from "passport";
import Auth0Strategy, { ExtraVerificationParams, StrategyOption } from "passport-auth0";
// const authRouter = require("./auth");
import authRouter from "./src/routes/auth"
dotenv.config();

//defining port
const PORT: string | number = process.env.PORT || 5000;
const app: Express = express();

//sample testing
app.get("/uat/test", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server ");
});


/**
 * Session Configuration 
 * https://auth0.com/blog/create-a-simple-and-secure-node-express-app/ reference
 */
const session: any = {
    secret: process.env.SESSION_SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: false
};

if (app.get("env") === "production") {
    // Serve secure cookies, requires HTTPS
    session.cookie.secure = true;
}



/**
 * Passport Configuration (New!)
 */



const strategy = new Auth0Strategy(
    {
        domain: process.env.AUTH0_DOMAIN,//from https://auth0.com/ site userAcc i got this which is me:) only
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: process.env.AUTH0_CALLBACK_URL
    } as StrategyOption,

    //verify callback function to  finding the user that possesses a set of credentials.
    function (accessToken: string, refreshToken: string, extraParams: ExtraVerificationParams, profile: Profile, done: (error: any, user?: any, info?: any) => void,): void {
        /**
         * Access tokens are used to authorize users to an API
         * (resource server)
         * accessToken is the token to call the Auth0 API
         * or a secured third-party API
         * extraParams.id_token has the JSON Web Token
         * profile has all the information from the user
         */
        return done(null, profile);
    }
);




/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
// console.log(__dirname)
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

app.use(expressSession(session));

passport.use(strategy);
app.use(passport.initialize());//initializing 
app.use(passport.session());

passport.serializeUser((user: Express.User, done: (err: any, id?: any) => void) => {
    done(null, user);
});

passport.deserializeUser((user: Express.User, done: (err: any, id?: any) => void) => {
    done(null, user);
});


// Creating custom middleware with Express
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});



// Router mounting

app.use("/", authRouter);// auth from auth0
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




