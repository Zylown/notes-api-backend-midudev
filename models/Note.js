// const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
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