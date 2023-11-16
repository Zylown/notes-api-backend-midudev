// const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", //referencia al modelo User
  },
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id; //elimina el id de mongo
    delete returnedObject.__v; //elimina el __v de mongo
  },
});

const Note = mongoose.model("Note", noteSchema); //modelo de mongoose

module.exports = Note;

// Note.find({}).then((result) => {
//   //el ({}) significa que no hay filtros al buscar datos
//   console.log(result);
//   mongoose.connection.close();
// });

// const note = new Note({
//   content: "Mongodb es increible",
//   date: new Date(),
//   important: true,
// });

// note
//   .save()
//   .then((result) => {
//     console.log(result);
//     mongoose.connection.close();
//   })
//   .catch((error) => {
//     console.log(error);
//   });
