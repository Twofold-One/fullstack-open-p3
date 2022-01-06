import mongoose from 'mongoose';
// invalid types for this module
const uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URI;
const getURL = url ? url : '';

console.log('connecting to', url);

mongoose
    .connect(getURL)
    .then((result) => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB', error.message);
    });

const personSchema = new mongoose.Schema({
    id: Number,
    name: {
        type: String,
        minlength: 3,
        required: true,
        unique: true,
    },
    number: {
        type: String,
        minlength: 8,
        required: true,
    },
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

// applying unique validator
personSchema.plugin(uniqueValidator);

const Person = mongoose.model('Person', personSchema);

export default Person;
