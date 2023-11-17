const uniqueValidator = require("mongoose-unique-validator");
const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    unique: true, //asegura que no haya dos usuarios con el mismo nombre
    minlength: 3, //longitud minima de 3 caracteres
    required: true, //campo requerido
  },
  // username: String,
  name: String,
  passwordHash: String,
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note",
    },
  ],
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id; //elimina el id de mongo
    delete returnedObject.__v; //elimina el __v de mongo

    delete returnedObject.passwordHash; //elimina el passwordHash de mongo
  },
});

userSchema.plugin(uniqueValidator); //aplica el plugin uniqueValidator al esquema

const User = model("User", userSchema); //modelo llamado User y el esquema userSchema

module.exports = User;
