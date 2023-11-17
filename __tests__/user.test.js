const mongoose = require("mongoose");
const { server } = require("../index"); // Link to your server file
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { api, getAllUsersFromDB } = require("../__tests__/helpers");

describe.only("creating a new user", () => {
  beforeEach(async () => {
    await User.deleteMany({}); //borra todos los usuarios de la base de datos de test
    const passwordHash = await bcrypt.hash("pswd", 10); //encripta la contraseña
    const user = new User({ username: "root", passwordHash }); //crea un nuevo usuario

    await user.save(); //guarda el usuario en la base de datos
  });

  test("works as expected creating a fresh username", async () => {
    // const usersDB = await User.find({}); //busca todos los usuarios en la base de datos
    // const usersAtStart = usersDB.map((user) => user.toJSON()); //convierte los usuarios en objetos JSON
    const usersAtStart = await getAllUsersFromDB(); //obtiene todos los usuarios de la base de datos
    const newUser = {
      username: "zylown",
      name: "sevas",
      password: "1234",
    };
    /*envia una peticion post a la ruta /api/users con el nuevo usuario y 
    espera que la respuesta sea 200 y el tipo de contenido sea JSON*/
    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    // const usersDBAfter = await User.find({}); //busca todos los usuarios en la base de datos
    // const usersAtEnd = usersDBAfter.map((user) => user.toJSON()); //convierte los usuarios en objetos JSON

    const usersAtEnd = await getAllUsersFromDB(); //obtiene todos los usuarios de la base de datos
    //espera que el numero de usuarios sea 1 mas que antes
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
    //crea un array con los nombres de usuario
    const usernames = usersAtEnd.map((users) => users.username);
    //espera que el array contenga el nombre de usuario del nuevo usuario
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await getAllUsersFromDB(); //obtiene todos los usuarios de la base de datos
    const newUser = {
      username: "root",
      name: "Superuser",
      password: "1234",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("`username` to be unique");
    // expect(result.body.error.errors.username.message).toContain("el usuario tiene que ser unico");
    const usersAtEnd = await getAllUsersFromDB(); //obtiene todos los usuarios de la base de datos
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  afterAll(() => {
    mongoose.connection.close();
    // despues de que se ejecuten todos los tests
    server.close(); //cerramos el servidor
  });
});
