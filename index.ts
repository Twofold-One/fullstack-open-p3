import express, { request, response } from 'express';

const app = express();

// Middleware
app.use(express.json());

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
    response.json(persons);
});

// fetch a single person by id
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find((person) => person.id === id);

    person
        ? response.json(person)
        : response.status(404).send(`Person with id ${id} was not found`).end();
});

// delete a single person by id
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter((person) => person.id !== id);

    response.status(204).send(`person with id ${id} deleted`).end();
});

// add a single person
app.post('/api/persons', (request, response) => {
    const person = request.body;
    console.log(person);
    response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Serever running on port ${PORT}`);
});

// Native NODE implementation

// import http from 'http';
// import persons from './persons';

// const app = http.createServer((request, response) => {
//     response.writeHead(200, { 'Content-Type': 'text/plain' });
//     response.end(JSON.stringify(persons));
// });

// const PORT = 3001;
// app.listen(PORT);
// console.log(`Serever is running on port ${PORT}`);
