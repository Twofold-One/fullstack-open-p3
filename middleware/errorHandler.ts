import express from 'express';

const errorHandler = (
    error: Error,
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
) => {
    console.log(error.message);

    error.message === 'CastError'
        ? response.status(400).send({ error: 'malformatted id' })
        : next(error);
};

export default errorHandler;
