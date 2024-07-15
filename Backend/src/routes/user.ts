import express from 'express';
import authenticate from "../middleware/authentication"
import { NextFunction, Request, Response } from 'express';

const router = express.Router();

router.get('/profile', authenticate as any, (req: any, res: Response) => {
    res.json({ message: `Welcome ${req?.user?.username}` });
});

export = router;