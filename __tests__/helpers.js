const { app } = require("../index"); // Link to your server file
const supertest = require("supertest");
const  User  = require("../models/User"); // Link to your Note mongoose model
const api = supertest(app);

const initialNotes = [
  {
    content: "Aprendiendo FullStack JS con midudev",
    important: true,
    date: new Date(),
  },
  {
    content: "Sigueme en youtube",
    important: true,
    date: new Date(),
  },
  {
    content: "Gracias al chat por todo el apoyo",
    important: true,
    date: new Date(),
  },
];

const getAllContentFromNotes = async () => {
  const response = await api.get("/api/notes");
  return {
    contents: response.body.map((note) => note.content),
    response,
  };
};

const getAllUsersFromDB = async () => {
  const usersDB = await User.find({}); //busca todos los usuarios en la base de datos
  return usersDB.map((user) => user.toJSON()); //convierte los usuarios en objetos JSON
};

module.exports = {
  getAllContentFromNotes,
  api,
  initialNotes,
  getAllUsersFromDB,
};
