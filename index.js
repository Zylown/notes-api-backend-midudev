require("dotenv").config(); //ver si tenemos este archivo .env y leerlo
const Note = require("./models/Note");

// const http = require("http");
const Sentry = require("@sentry/node");
const express = require("express");
const cors = require("cors"); // Importa el módulo cors
// const crypto = require("crypto"); // Importa el módulo crypto
const app = express();
const logger = require("./loggerMiddleware");
const notFound = require("./middleware/notFound.js");
const handleErrors = require("./middleware/handleErrors.js");
require("./mongo.js");
const User = require("./models/User.js");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
// const jwt = require("jsonwebtoken");
const userExtractor = require("./middleware/userExtractor.js");

app.use(express.json()); //Middleware que permite a express parsear el body de la request a JSON
app.use(cors()); // Middleware que permite a express usar CORS
app.use(logger);
app.use("/images", express.static("images")); // Middleware que permite a express servir archivos estáticos
/* const app = http.createServer((request, response) => {
//   response.writeHead(200, { "Content-Type": "application/JSON" });
//   response.end(JSON.stringify(notes));
 });*/

Sentry.init({
  dsn: "https://95f975b8283ed1d7622b7211f45b517a@o4506215651016704.ingest.sentry.io/4506215677296640",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0,
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", async (request, response) => {
  // await Note.find({}).then((notes) => {
  //   response.json(notes);
  // });
  //es lo mismo que lo de arriba
  // populate rellena el campo user con el objeto del usuario
  const notes = await Note.find({}).populate("user", { username: 1, name: 1 });
  response.json(notes);
});

app.get("/api/notes/:id", async (request, response, next) => {
  const id = request.params.id;
  // const note = notes.find((note) => note.id === id);

  await Note.findById(id)
    .then((note) => {
      // si tiene la nota devuelve la nota(200)
      return note ? response.json(note) : response.status(404).end();
      //si no tiene la nota devuelve un 404
    })
    .catch((error) => next(error)); //si tienes un error va al siguiente middleware
  // console.log(error.message);
  // response.status(400).end(); //error de servicio no disponible
});

app.put("/api/notes/:id", userExtractor, (request, response, next) => {
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

app.delete("/api/notes/:id", userExtractor, async (request, response, next) => {
  /*const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id); //se guardaran todas las notas menos la que estamos borrando
  console.log({ id });
  response.status(204).end();*/

  const { id } = request.params;
  const res = await Note.findByIdAndDelete(id);
  if (res === null) return response.sendStatus(404);
  response.status(204).end();
  // .then(() => response.status(204).end())
  // .catch((error) => next(error)); //si tienes un error va al siguiente middleware
});

app.post("/api/notes", userExtractor, async (request, response) => {
  //esto es enviarselo por el cuerpo de la request
  const { content, important = false } = request.body;

  //sacar userId de request
  const { userId } = request;

  const user = await User.findById(userId);

  if (!content) {
    return response.status(400).json({
      error: "note.content is missing",
    });
  }

  const newNote = new Note({
    content,
    date: new Date(),
    important,
    user: user._id,
  });

  // newNote
  //   .save()
  //   .then((savedNote) => response.status(201).json(savedNote)) // Solo envía la nota guardada, no newNote
  //   .catch((error) => next(error));

  try {
    const savedNote = await newNote.save();
    //concatena el id de la nota guardada con el array de notas del usuario
    user.notes = user.notes.concat(savedNote._id);
    await user.save(); //guarda el usuario con el id de la nota
    response.json(savedNote);
    // response.status(201).json(savedNote);
  } catch (error) {
    next(error);
  }

  // const id = crypto.randomUUID();
  /*const ids = notes.map((note) => note.id)
	const maxId = Math.max(...ids)*/
  console.log({ newNote });
});

// app.use((request, response) => {
//   // console.log(request.path);
//   response.status(404).json({
//     error: "Not found",
//   });
// });

// The error handler must be registered before any other error middleware and after all controllers

app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(notFound);

app.use(Sentry.Handlers.errorHandler());

app.use(handleErrors);

const PORT = 3001;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server };
