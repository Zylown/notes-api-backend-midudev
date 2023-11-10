const mongoose = require("mongoose");
const password = require("./password.js");

const connectionString = process.env.MONGO_DB_URI;

//conexion a mongodb
mongoose
  .connect(connectionString)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });
