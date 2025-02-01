import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { config } from "src/config";
import AuthenticationError from "src/errors/authentication-error";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if(!token) throw new AuthenticationError("Unauthorized User")
    
    jwt.verify(token, config.JWT_SECRET, (err: any, user: any) => {
        if(err) return new AuthenticationError('Invalid Token!!!');
            req.user = user
            next()
    })
}