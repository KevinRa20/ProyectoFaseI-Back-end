const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const router = express.Router();

const Stripe = require("stripe");
const stripe = Stripe("sk_test_51TCP6gGPea1HEkaiOeWoeBlsuqP8c5lhQC9C0ZR81XzhB9k4Xl7BERnjrYMT0YViXmOYAuIGiA70XqePA9Eg5eh000qIZ0ogNd");
// Registro de usuario 
router.post("/register", async (req, res) => {
const { name, email, password, rol, plan, priceId } = req.body;
 if (!name || !email || !password || !rol) {
return res.status(400).json({ msg: "Todos los campos son obligatorios" });
}
try {
const existingUser = await User.findOne({ email });
if (existingUser) {
return res.status(400).json({ msg: "El usuario ya existe" });}
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
// Crear cliente Stripe
const customer = await stripe.customers.create({
email,
name, });
const newUser = new User({
name,
email,
password: hashedPassword,
rol,
plan: plan || "basic",
stripeCustomerId: customer.id
});
await newUser.save();
// Plan gratuito
if (!priceId) {
return res.status(201).json({
 msg: "Usuario registrado con plan gratuito",
user: {
id: newUser._id,
name: newUser.name,
email: newUser.email,
rol: newUser.rol,
plan: newUser.plan
}});}
// Plan de pago (registro inicial)
const session = await stripe.checkout.sessions.create({
mode: "subscription",
customer: customer.id,
payment_method_types: ["card"],
line_items: [
{
price: priceId,
quantity: 1
}],
success_url: `http://localhost:5173/success?userId=${newUser._id}&plan=${plan}`,
cancel_url: "http://localhost:5173/cancel",
metadata: {
userId: newUser._id.toString(),
plan
}});
return res.status(201).json({
 msg: "Usuario creado, redirigir a pago",
url: session.url
});
} catch (error) {
console.error(error);
return res.status(500).json({ msg: "Error en el servidor" });
}
});
// Login
router.post("/login", async (req, res) => {
const { email, password } = req.body;
if (!email || !password) {
return res.status(400).json({ msg: "Todos los campos son obligatorios" });
}
try {
const user = await User.findOne({ email });
if (!user) {
return res.status(404).json({ msg: "Usuario no encontrado" });
}
const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
return res.status(401).json({ msg: "Contraseña incorrecta" });
}
return res.json({
msg: "Login exitoso",
id: user._id,
rol: user.rol,
name: user.name,
plan: user.plan
});
} catch (error) {
console.error(error);
return res.status(500).json({ msg: "Error en el servidor" });
}
});
// Nuevo: CREATE CHECKOUT (Actualizar el plan )
router.post("/create-checkout-session", async (req, res) => {
const { priceId, userId, plan } = req.body;
try {
const dbUser = await User.findById(userId);
if (!dbUser) {
return res.status(404).json({ msg: "Usuario no encontrado" });}
// Caso 1: Ya tiene un plan-Actualizarlo
if (dbUser.subscriptionId) {
const subscription = await stripe.subscriptions.retrieve(
dbUser.subscriptionId
);
await stripe.subscriptions.update(dbUser.subscriptionId, {
items: [
{id: subscription.items.data[0].id, price: priceId,
},],});
return res.json({
msg: "Plan actualizado correctamente",
});}
// Caso 2: No tiene-registrar un plan 
const session = await stripe.checkout.sessions.create({
mode: "subscription",
customer: dbUser.stripeCustomerId,
payment_method_types: ["card"],
line_items: [
{price: priceId, quantity: 1,},],
success_url: `http://localhost:5173/success?userId=${dbUser._id}&plan=${plan}`,
cancel_url: "http://localhost:5173/cancel",
metadata: {userId: dbUser._id.toString(),plan,
},});
return res.json({ url: session.url });
} catch (error) {
console.error(error);
 return res.status(500).json({ msg: "Error en Stripe" });
}
});

// Actualizar el plan despues del pago
router.post("/update-plan", async (req, res) => {
const { userId, plan } = req.body;
try {await User.findByIdAndUpdate(userId, {
plan});
return res.json({
msg: "Plan actualizado correctamente"
});
} catch (error) {console.error(error);
return res.status(500).json({ msg: "Error actualizando plan" });
}
});

module.exports = router;