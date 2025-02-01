import { Request, Response, NextFunction } from 'express';
import AuthenticationError from 'src/errors/authentication-error';


const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AuthenticationError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    // Handle other types of errors
    res.status(500).json({ error: 'An unexpected error occurred' });
};

export default errorHandler;