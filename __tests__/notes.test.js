const mongoose = require("mongoose");
const { server } = require("../index"); // Link to your server file
const Note = require("../models/Note"); // Link to your Note mongoose model
const { api, initialNotes, getAllContentFromNotes } = require("./helpers"); // Link to your helper file

beforeEach(async () => {
  //antes de cada test ejecutame este metodo que es asincrono
  await Note.deleteMany({}); //elimina todos las notas de la coleccion
  //paralelo
  // const notesObjects = initialNotes.map((note) => new Note(note)); //creamos un array de notas con el array de notas inicial
  // const promises = notesObjects.map((note) => note.save()); //guardamos las notas en la base de datos
  // await Promise.all(promises); //esperamos a que se guarden todas las notas en la base de datos
  //sequencial
  for (const note of initialNotes) {
    const noteObject = new Note(note);
    await noteObject.save();
  }

  // initialNotes.forEach(async (note) => {
  //   //recorremos el array de notas inicial
  //   const noteObject = new Note(
  //     note
  //   ); /*creamos una nota con el primer objeto del array*/
  //   await noteObject.save(); //guardamos la nota en la base de datos
  // }); //recorremos el array de notas inicial

  // const note1 = new Note(initialNotes[0]); //creamos una nota con el primer objeto del array
  // await note1.save(); //guardamos la nota en la base de datos

  // const note2 = new Note(initialNotes[0]); //creamos una nota con el primer objeto del array
  // await note2.save(); //guardamos la nota en la base de datos
});

describe("GET all notes", () => {
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
    const { contents } = await getAllContentFromNotes(); //creamos un array con el contenido de cada nota
    expect(contents).toContain("Aprendiendo FullStack JS con midudev");
    //esperamos que el primer elemento del body tenga el mismo contenido que el primer elemento del array de notas inicial
  });
});
describe("create a note", () => {
  test("is possible with a valid note", async () => {
    const newNote = {
      content: "Proximamente async/await",
      important: true,
    };
    await api
      .post("/api/notes") //hacemos una peticion post a la ruta /api/notes
      .send(newNote) //enviamos la nueva nota
      .expect(201) //esperamos que el status sea 201
      .expect("Content-Type", /application\/json/); //esperamos que el tipo de contenido sea json

    const { contents, response } = await getAllContentFromNotes(); //creamos un array con el contenido de cada nota

    expect(response.body).toHaveLength(initialNotes.length + 1); //esperamos que el body de la respuesta tenga la misma longitud que el array de notas inicial + 1
    expect(contents).toContain(newNote.content); //esperamos que el array de contenidos contenga el contenido de la nueva nota
  });

  test("is possible with a invalid note", async () => {
    const newNote = {
      important: true,
    };
    await api
      .post("/api/notes") //hacemos una peticion post a la ruta /api/notes
      .send(newNote) //enviamos la nueva nota
      .expect(400); //esperamos que el status sea 400

    const response = await api.get("/api/notes"); //hacemos una peticion get a la ruta /api/notes

    expect(response.body).toHaveLength(initialNotes.length);
  });
});

test("a note can be deleted", async () => {
  const { response: firstResponse } = await getAllContentFromNotes();
  const { body: notes } = firstResponse;
  const noteToDelete = notes[0]; //destructuramos el primer elemento del array de notas

  await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

  const { contents, response: secondResponse } = await getAllContentFromNotes();
  expect(secondResponse.body).toHaveLength(initialNotes.length - 1); //esperamos que el body de la respuesta tenga la misma longitud que el array de notas inicial - 1
  expect(contents).not.toEqual(noteToDelete.content); //esperamos que el array de contenidos no contenga el contenido de la nota que hemos borrado
});

test("a note that has an invalid id can not be deleted", async () => {
  await api.delete("/api/notes/1234").expect(400);

  const { response } = await getAllContentFromNotes();

  expect(response.body).toHaveLength(initialNotes.length);
});

afterAll(() => {
  mongoose.connection.close();
  // despues de que se ejecuten todos los tests
  server.close(); //cerramos el servidor
});
