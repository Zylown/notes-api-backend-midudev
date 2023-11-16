const bcrypt = require("bcrypt");
const userRouter = require("express").Router(); //el router de express es para crear rutas
const User = require("../models/User");

userRouter.post("/", async (request, response, next) => {
  const { body } = request;
  const { username, name, password } = body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds); //el 10 es el numero de veces que se ejecuta el algoritmo de encriptacion
  const user = new User({
    username,
    name,
    passwordHash
  });
  const savedUser = await user.save();
  response.json(savedUser);
});

module.exports = userRouter;
