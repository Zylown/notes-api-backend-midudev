const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router(); // es para crear rutas
const User = require("../models/User");

loginRouter.post("/", async (req, res) => {
  const { body } = req;
  const { username, password } = body;

  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);
  // compara la contraseña que se envia con la que esta en la base de datos
  if (!(user && passwordCorrect)) {
    // si no existe el usuario o la contraseña es incorrecta
    return res.status(401).json({
      error: "invalid user or password",
    });
  }

  const userForToken = {
    id: user._id,
    username: user.username,
  };

  const token = jwt.sign(userForToken, process.env.SECRET); // se crea el token

  res.send({
    name: user.name,
    username: user.username,
    token,
  });
});

module.exports = loginRouter;
