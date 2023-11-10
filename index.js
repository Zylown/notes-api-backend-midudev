const Note = require("./models/Note");

// const http = require("http");
const express = require("express");
const cors = require("cors"); // Importa el módulo cors
const crypto = require("crypto"); // Importa el módulo crypto
const app = express();
const logger = require("./loggerMiddleware");
require("./mongo.js");

app.use(express.json()); //Middleware que permite a express parsear el body de la request a JSON
app.use(cors()); // Middleware que permite a express usar CORS
app.use(logger);

let notes = [];

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { "Content-Type": "application/JSON" });
//   response.end(JSON.stringify(notes));
// });

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);
  console.log({ id });
  // response.send(id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id); //se guardaran todas las notas menos la que estamos borrando
  console.log({ id });
  response.status(204).end();
});

app.post("/api/notes", (request, response) => {
  const note = request.body;

  if (!note || !note.content) {
    return response.status(400).json({
      error: "note.content is missing",
    });
  }

  const id = crypto.randomUUID();
  /*const ids = notes.map((note) => note.id)
	const maxId = Math.max(...ids)*/

  console.log({ note });
  const newNote = {
    id: id,
    content: note.content,
    important: typeof note.important !== "undefined" ? note.important : false,
    date: new Date().toISOString(),
  };
  notes = [...notes, newNote];
  response.status(201).json(newNote);
});

app.use((request, response) => {
  // console.log(request.path);
  response.status(404).json({
    error: "Not found",
  });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
