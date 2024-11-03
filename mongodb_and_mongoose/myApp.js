require('dotenv').config();
const mongoose = require('mongoose')

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true
  , useUnifiedTopology: true
  }
)
// .then(() => console.log("Connected to MongoDB"))
// .catch(error => console.error("Connection error", error));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age : {
    type: Number
  },
  favoriteFoods: {
    type: [String]
  }
})

let Person = mongoose.model("Person", personSchema);
exports.PersonModel = Person;

const createAndSavePerson = (done) => {
  const person = new Person({
    name: "John Doe",
    age: 25,
    favoriteFoods: ["Pizza"]
  });

  person.save((err, doc) => {
    if (err) return done(err);
    done(null, doc);
  });
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, docs) => {
    if (err) return done(err);
    done(null, docs);
  });
};

const findPeopleByName = (personName, done) => {
  Person.find({
    name: personName
  })
  .then((doc) => done(null, doc))
  .catch(err => done(err));
};

const findOneByFood = (food, done) => {
  Person
    .findOne({
      favoriteFoods : food
    })
    .then((doc) => done(null, doc))
    .catch(err => done(err));
};

const findPersonById = (personId, done) => {
  Person
    .findById(personId)
    .then(doc => done(null, doc))
    .catch(err => done(err))
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  findPersonById(personId, (err, person) => {
    if (err) return done(err);

    person.favoriteFoods.push(foodToAdd);
    person
      .save()
      .then(doc => done(null, doc))
      .catch(err => done(err));
  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate(
    { name: personName },
    { age: ageToSet,
      useFindAndModify: false
    },
    { new: true }
  )
  .then((doc) => done(null, doc))
  .catch(err => done(err));
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(
    personId,
    { useFindAndModify: false }
  )
  .then((doc) => done(null, doc))
  .catch(err => done(err));
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  Person.remove({
    name: nameToRemove
  })
  .then(result => done(null, result))
  .catch(err => done(err));
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  Person
    .find({ favoriteFoods: foodToSearch })
    .sort({ name: 1 })
    .limit(2)
    .select('-age')
    .exec()
    .then((docs) => done(null, docs))
    .catch(err => done(err));
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

// exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
