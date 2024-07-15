import jwt from 'jsonwebtoken';
import User from '../models/User';
import { NextFunction, Request, Response } from 'express';
import { IGetUserAuthInfoRequest } from '../types/globalTypes';


const authenticate = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const token: string | undefined = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decodedToken: string | any = jwt.verify(token, `${process.env.SECRET_KEY}`);
        console.log(decodedToken);

        const user = await User.findById(decodedToken.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default authenticate

