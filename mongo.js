const mongoose = require("mongoose");
// const password = require("./password.js");

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env;

const connectionString =
  NODE_ENV === "test" //usamos la base de datos de test
    ? MONGO_DB_URI_TEST //si no, usamos la base de datos de produccion
    : MONGO_DB_URI; // si no, usamos la base de datos de desarrollo

//conexion a mongodb
mongoose
  .connect(connectionString)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

process.on("uncaughtException", (error) => {
  //si hay un error en el servidor
  console.log(error);
  mongoose.disconnect();
});
