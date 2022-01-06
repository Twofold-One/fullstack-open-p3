import express from 'express';

const errorHandler = (
    error: Error,
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
) => {
    console.log(error.message);

    error.name === 'CastError'
        ? response.status(400).send({ error: 'malformatted id' })
        : error.name === 'ValidationError'
        ? response.status(400).json({ error: error.message })
        : next(error);
};

export default errorHandler;
