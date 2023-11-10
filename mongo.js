const mongoose = require("mongoose");
const password = require("./password.js");

const connectionString = `mongodb+srv://zylown:${password}@cluster0.wrim82n.mongodb.net/midudb?retryWrites=true&w=majority`;

//conexion a mongodb
mongoose
  .connect(connectionString)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });




