const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ["productor", "comprador"], required: true },
   plan: {
    type: String,
    default: "basic"
  },
  stripeCustomerId: String,
  subscriptionId: String
},{ collection: "RegistroUsuario" } );
  
module.exports = mongoose.model("User", UserSchema);