const supertest = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../index"); // Link to your server file

const api = supertest(app);

test("notes are returned as json", async () => {
  await api //hacemos una peticion a la ruta /api/notes
    .get("/api/notes") //hacemos una peticion get a la ruta /api/notes
    .expect(200) //esperamos que el status sea 200
    .expect("Content-Type", /application\/json/); //esperamos que el tipo de contenido sea json
});

test("there are two notes", async () => {
  const response = await api
    .get("/api/notes") //hacemos una peticion get a la ruta /api/notes
    .expect(response.body)
    .toHaveLength(2);
});

afterAll(() => {
  mongoose.connection.close();
  // despues de que se ejecuten todos los tests
  server.close(); //cerramos el servidor
});
