const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: String,
  name: String,
  passwordHash: String,
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note",
    },
  ],
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id; //elimina el id de mongo
    delete returnedObject.__v; //elimina el __v de mongo

    delete returnedObject.passwordHash; //elimina el passwordHash de mongo
  },
});

const User = model("User", userSchema); //modelo llamado User y el esquema userSchema

module.exports = User;
