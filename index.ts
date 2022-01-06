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

// Main code

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
});

app.get('/info', (request, response) => {
    Person.find({}).then((persons) => {
        response.send(`<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`);
    });
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
});

// delete a single person by id
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then((result) => {
            response
                .status(204)
                .send(`person with id ${request.params.id} deleted`)
                .end();
        })
        .catch((error) => next(error));
});

// function generates uniqe id
const generateId = (): number => {
    const uid = Math.floor(Math.random() * Date.now());
    return uid;
};

// check for name repeat
const nameRepeatCheck = async (name: string): Promise<boolean> => {
    const personsData = await Person.find({});
    const repeatDetected = await personsData.find(
        (person) => person.name === name
    );
    return repeatDetected ? true : false;
};

// add a single person
app.post('/api/persons', async (request, response) => {
    const person = request.body;

    if (!person.name || !person.number) {
        return response.status(400).json({
            error: 'name or number is missing',
        });
    } else if (await nameRepeatCheck(person.name)) {
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
});

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number,
    };

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then((updatedPerson) => {
            response.json(updatedPerson);
        })
        .catch((error) => next(error));
});

// error handling middleware
app.use(unknownEndpoint);
app.use(errorHandler);

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

// hardcoded data
// let persons = [
//     {
//         id: 1,
//         name: 'Arto Hellas',
//         number: '040-123456',
//     },
//     {
//         id: 2,
//         name: 'Ada Lovelace',
//         number: '39-44-5323523',
//     },
//     {
//         id: 3,
//         name: 'Dan Abramov',
//         number: '12-43-234345',
//     },
//     {
//         id: 4,
//         name: 'Mary Poppendieck',
//         number: '39-23-6423122',
//     },
// ];
