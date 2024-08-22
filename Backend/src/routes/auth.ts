import express, { Router } from 'express';
import { register, login } from '../controllers/auth';
import passport from "passport";
import querystring from "querystring";
import dotenv from "dotenv";
dotenv.config();

const router: Router = express.Router();

//to register an user
router.post('/register', register);

//to login an user
router.post('/login', login);




/**
 * Routes Definitions
 */
router.get(
    "/Login",
    passport.authenticate("auth0", {
        scope: "openid email profile"
    }),
    (req, res) => {
        res.redirect("/");
    }
);


router.get("/callback", (req: any, res: any, next) => {
    passport.authenticate("auth0", (err: any, user: any, info: any) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect("/login");
        }
        req.logIn(user, (err: any) => {
            if (err) {
                return next(err);
            }
            const returnTo = req.session.returnTo;
            delete req.session.returnTo;
            res.redirect(returnTo || "/");
        });
    })(req, res, next);
});


router.get("/logout", (req: any, res: any) => {
    req.logOut();

    let returnTo = req.protocol + "://" + req.hostname;
    const port = req.connection.localPort;

    if (port !== undefined && port !== 80 && port !== 443) {
        returnTo =
            process.env.NODE_ENV === "production"
                ? `${returnTo}/`
                : `${returnTo}:${port}/`;
    }

    const logoutURL = new URL(
        `https://${process.env.AUTH0_DOMAIN}/v2/logout`
    );

    const searchString = querystring.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        returnTo: returnTo
    });
    logoutURL.search = searchString;

    res.redirect(logoutURL);
});



/**
 * Module Exports
 */
module.exports = router;
export = router;