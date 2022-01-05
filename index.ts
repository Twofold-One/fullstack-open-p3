import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import unknownEndpoint from './middleware/unknownEndpoint';
import errorHandler from './middleware/errorHandler';
import morgan from 'morgan';
import cors from 'cors';
import Person from './models/person';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
morgan.token('body', (request: express.Request, response: express.Response) =>
    JSON.stringify(request.body)
);
app.use(
    morgan(
        ':method :url :status :res[content-length] - :response-time ms :body'
    )
);
app.use(express.static('build'));
app.use(unknownEndpoint);
app.use(errorHandler);

// hardcoded data
let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456',
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523',
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345',
    },
    {
        id: 4,
        name: 'Mary Poppendieck',
        number: '39-23-6423122',
    },
];

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
});

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`);
});

app.get('/api/persons', (request, response) => {
    Person.find({}).then((persons) => {
        response.json(persons);
    });
});

// fetch a single person by id
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then((person) => {
            person ? response.json(person) : response.status(404).end();
        })
        .catch((error) => next(error));
    // const id = Number(request.params.id);
    // const person = persons.find((person) => person.id === id);

    // person
    //     ? response.json(person)
    //     : response.status(404).send(`Person with id ${id} was not found`).end();
});
// delete a single person by id
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter((person) => person.id !== id);

    response.status(204).send(`person with id ${id} deleted`).end();
});

// function generates uniqe id
const generateId = (): number => {
    const uid = Math.floor(Math.random() * Date.now());
    return uid;
};

// check for name repeat
const nameRepeatCheck = (name: string): boolean => {
    const repeatDetected = persons.find((person) => person.name === name);
    return repeatDetected ? true : false;
};

// add a single person
app.post('/api/persons', (request, response) => {
    const person = request.body;

    if (!person.name || !person.number) {
        return response.status(400).json({
            error: 'name or number is missing',
        });
    } else if (nameRepeatCheck(person.name)) {
        return response.status(400).json({
            error: 'name must be unique',
        });
    }

    person.id = generateId();

    const newPerson = new Person({
        id: generateId(),
        name: person.name,
        number: person.number,
    });

    newPerson
        .save()
        .then((savedPerson: { id: number; name: string; number: string }) => {
            response.json(savedPerson);
        });

    // persons = persons.concat(person);

    // response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Serever running on port ${PORT}`);
});

//
// Native NODE implementation
//

// import http from 'http';
// import persons from './persons';

// const app = http.createServer((request, response) => {
//     response.writeHead(200, { 'Content-Type': 'text/plain' });
//     response.end(JSON.stringify(persons));
// });

// const PORT = 3001;
// app.listen(PORT);
// console.log(`Serever is running on port ${PORT}`);
