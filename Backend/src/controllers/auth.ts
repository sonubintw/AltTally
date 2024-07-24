import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User';
import { NextFunction, Request, Response } from 'express';

// Register a new user
let customError: any
export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;

    try {
        // const hashedPassword: string = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password });
        console.log(user);

        if (!email || !username || !password) {
            customError = new Error('Please fill all the required fields')
            res.status(400)
            return next(customError)
        }

        const userExist = await User.findOne({ email })
        if (userExist) {
            let err = new Error("Email already exists please try logging in")
            res.status(400)
            return next(err)
        }

        const usernameExist = await User.findOne({ username })
        if (usernameExist) {
            let err = new Error(`UserName ${username} thas already been taken`)
            res.status(400)
            return next(err)
        }


        await user.save();
        res.json({ message: 'Registration successful' });
    } catch (error: any | unknown) {
        console.log(error);
        res.status(406)
        customError = new Error('mkb')
        //pass control to the next middleware to not break the code/server
        next(error);
    }
};

// Login with an existing user
export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;


    try {
        const user = await User.findOne({ username });


        if (!user) {
            // return res.status(404).json({ message: 'User not found' });

        }

        // const passwordMatch: boolean = await user.comparePassword(password);
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log("line 50", passwordMatch);

        if (!passwordMatch) {
            customError = new Error('Check your password or username')
            res.status(400)
            return next(customError)
        }

        const token: string = jwt.sign({ userId: user._id }, `${process.env.SECRET_KEY}`, {
            expiresIn: '1 hour'
        });
        res.json({ token });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login };