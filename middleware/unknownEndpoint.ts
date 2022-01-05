import express from 'express';

const unknownEndpoint = (
    request: express.Request,
    response: express.Response
) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

export default unknownEndpoint;
