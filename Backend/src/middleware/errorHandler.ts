import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

export const erroHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode: number = res.statusCode ? res.statusCode : 500
    res.status(statusCode).json({
        message: err.message,//err.message and err.stack is already present in express error inbuit handler
        stack: err.stack,
        status: res.statusCode
    })
    //send to next middleware
    next()
}
