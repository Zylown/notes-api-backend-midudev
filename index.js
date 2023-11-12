require("dotenv").config(); //ver si tenemos este archivo .env y leerlo
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

app.get("/api/notes/:id", (request, response, next) => {
  const id = request.params.id;
  // const note = notes.find((note) => note.id === id);

  Note.findById(id)
    .then((note) => {
      if (note) {
        return response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
      // console.log(error.message);
      // response.status(400).end(); //error de servicio no disponible
    });

  // console.log({ id });

  // response.send(id);
  // if (note) {
  //   response.json(note);
  // } else {
  //   response.status(404).end();
  // }
});

app.put("/api/notes/:id", (request, response, next) => {
  const { id } = request.params;
  const note = request.body;

  const newNoteInfo = {
    content: note.content,
    important: note.important,
  };

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true }).then((result) => {
    response.json(result);
  });
});

app.delete("/api/notes/:id", (request, response, next) => {
  /*const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id); //se guardaran todas las notas menos la que estamos borrando
  console.log({ id });
  response.status(204).end();*/

  const { id } = request.params;
  Note.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error)); //si tienes un error va al siguiente middleware
});

app.post("/api/notes", (request, response) => {
  const note = request.body;

  if (!note || !note.content) {
    return response.status(400).json({
      error: "note.content is missing",
    });
  }

  const newNote = new Note({
    content: note.content,
    important: typeof note.important !== "undefined" ? note.important : false,
    date: new Date().toISOString(),
  });

  newNote.save().then((savedNote) => {
    // response.json(savedNote);
    // response.status(201).json(newNote); //MAL
    response.status(201).json(savedNote); // Solo envía la nota guardada, no newNote
  });
  const id = crypto.randomUUID();
  /*const ids = notes.map((note) => note.id)
	const maxId = Math.max(...ids)*/
  console.log({ note });
});

// app.use((request, response) => {
//   // console.log(request.path);
//   response.status(404).json({
//     error: "Not found",
//   });
// });

app.use((error, request, response, next) => {
  console.error(error);
  console.log(error.name);
  if (error.name === "CastError") {
    response.status(400).send({ error: "Id no está bien usada" });
  } else {
    response.status(500).end();
  }
  // response.status(400).end();
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
