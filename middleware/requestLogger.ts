// Custom middleware
import express from 'express';

const requestLogger = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
) => {
    console.log('Method:', request.method);
    console.log('Path:', request.path);
    console.log('Headers:', request.headers);
    console.log('Body:', request.body);
    console.log('---');
    next();
};

export default requestLogger;
