import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User';
import { NextFunction, Request, Response } from 'express';

// Register a new user
export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword: string = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        console.log(user);

        await user.save();
        res.json({ message: 'Registration successful' });
    } catch (error: any | unknown) {
        console.log(error);

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
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordMatch = await user.comparePassword(password);
        console.log(passwordMatch);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
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