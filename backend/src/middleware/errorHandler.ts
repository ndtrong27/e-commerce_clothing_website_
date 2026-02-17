
import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import { isProduction } from '../config/environment';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Always log full error server-side
    logger.error('Request error', {
        message: err.message,
        stack: err.stack,
        method: req.method,
        path: req.path,
        ip: req.ip,
        statusCode: err.statusCode || 500,
    });

    const statusCode = err.statusCode || err.status || 500;

    // Production: generic messages only — no leaking internals
    const response = {
        success: false,
        message: isProduction
            ? (statusCode < 500 ? err.message : 'An unexpected error occurred')
            : err.message,
        // Only include stack trace in development
        ...(isProduction ? {} : { stack: err.stack }),
    };

    res.status(statusCode).json(response);
};

export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.path}`,
    });
};
