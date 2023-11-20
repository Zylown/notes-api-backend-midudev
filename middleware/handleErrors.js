const ERROR_HANDLERS = {
  CastError: (response) =>
    response.status(400).send({ error: "Id no está bien usada" }),

  ValidationError: (response, { message }) =>
    response.status(409).send({ error: message }),

  JsonWebTokenError: (response) =>
    response.status(401).send({ error: "Token invalid" }),

  defalutError: (response) => response.status(500).end(),
};
module.exports = (error, request, response, next) => {
  console.error(error);
  console.log(error.name);

  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defalutError;
  handler(response, error);
};
