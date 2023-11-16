const User = require("../models/User");
const bcrypt = require("bcrypt");

describe("creating a new user", () => {
  beforeEach(async () => {
    await User.deleteMany({}); //borra todos los usuarios de la base de datos de test
    const passwordHash = await bcrypt.hash("pswd", 10); //encripta la contraseña
    const user = new User({ username: "root", passwordHash }); //crea un nuevo usuario

    await user.save(); //guarda el usuario en la base de datos
  });
  test()
});
