const supertest = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../index"); // Link to your server file
const Note = require("../models/Note"); // Link to your Note mongoose model

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
];

beforeEach(async () => {
  //antes de cada test ejecutame este metodo que es asincrono
  await Note.deleteMany({}); //elimina todos las notas de la coleccion

  const note1 = new Note(initialNotes[0]); //creamos una nota con el primer objeto del array
  await note1.save(); //guardamos la nota en la base de datos

  const note2 = new Note(initialNotes[0]); //creamos una nota con el primer objeto del array
  await note2.save(); //guardamos la nota en la base de datos
});

test("notes are returned as json", async () => {
  await api //hacemos una peticion a la ruta /api/notes
    .get("/api/notes") //hacemos una peticion get a la ruta /api/notes
    .expect(200) //esperamos que el status sea 200
    .expect("Content-Type", /application\/json/); //esperamos que el tipo de contenido sea json
});

test("there are two notes", async () => {
  const response = await api.get("/api/notes"); //hacemos una peticion get a la ruta /api/notes
  expect(response.body).toHaveLength(initialNotes.length); //esperamos que el body de la respuesta tenga la misma longitud que el array de notas inicial
});

test("the first note is about midudev", async () => {
  const response = await api.get("/api/notes"); //hacemos una peticion get a la ruta /api/notes
  const contents = response.body.map((note) => note.content); //creamos un array con el contenido de cada nota
  expect(contents).toBe("Aprendiendo FullStack JS con midudev"); //esperamos que el primer elemento del body tenga el mismo contenido que el primer elemento del array de notas inicial
});

afterAll(() => {
  mongoose.connection.close();
  // despues de que se ejecuten todos los tests
  server.close(); //cerramos el servidor
});
