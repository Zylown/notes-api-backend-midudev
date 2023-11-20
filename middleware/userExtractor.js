const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
  const authorization = request.get("authorization");
  let token = "";
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    //si existe el token y empieza por bearer
    //o también token = authorization.split(" ")[1]; // divide el token en dos y coge la segunda parte
    token = authorization.substring(7); //coge el token desde la posición 7
  }
  let decodedToken = {};
  try {
    decodedToken = jwt.verify(token, process.env.SECRET); //verifica el token con la clave secreta
  } catch (error) {
    console.log(error);
  }

  if (!token || !decodedToken.id) {
    //si no hay token o no hay id en el token
    return response.status(401).json({ error: "Token missing or invalido" }); //no autorizado
  }

  const { id: userIdToken } = decodedToken; //extrae el id del token
  request.userId = userIdToken;

  next();
};
