import mongoose from 'mongoose';

if (process.argv.length < 3) {
    console.log(
        'Please provide the password as an argument: node mongo.ts <password>'
    );

    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://evanfullstack:${password}@cluster0.fncty.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

// Code for generating new persons in phonebook-app database

const uid = Math.floor(Math.random() * Number(new Date()));
const personName = process.argv[3];
const personNumber = process.argv[4];

const person = new Person({
    id: uid,
    name: personName,
    number: personNumber,
});

const savePerson = () =>
    person.save().then(() => {
        console.log(`person ${person.name} saved to the database`);
        // mongoose.connection.close();
    });

// Code for fetching data from phonebook-app database

const getPhonebook = () =>
    Person.find({}).then((result) => {
        console.log('Phonebook:');
        result.forEach((person) => {
            console.log(person.name, person.number);
        });
        mongoose.connection.close();
    });

(async () => {
    await savePerson();
    getPhonebook();
})();
