import mongoose from 'mongoose';

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
    name: String,
    number: String,
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Person = mongoose.model('Person', personSchema);

export default Person;
