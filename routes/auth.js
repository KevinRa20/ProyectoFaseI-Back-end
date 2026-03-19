const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const router = express.Router();
require("dotenv").config();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/register", async (req, res) => {
  const { name, email, password, rol, plan, priceId } = req.body;

  if (!name || !email || !password || !rol) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //  1. Crear cliente en Stripe
    const customer = await stripe.customers.create({
      email,
      name,
    });

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      rol,
      plan: plan || "basic",
      stripeCustomerId: customer.id
    });

    await newUser.save();

    //  2. Si es plan gratis → no pagar
    if (!priceId) {
      return res.status(201).json({
        msg: "Usuario registrado con plan gratuito",
        user: {
          id: newUser._id,
          name,
          email,
          rol,
          plan: "basic"
        }
      });
    }

    //  3. Crear sesión de pago
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
      metadata: {
        userId: newUser._id.toString(),
        plan
      }
    });

    //  4. Devolver URL
    return res.status(201).json({
      msg: "Usuario creado, redirigir a pago",
      url: session.url
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
});


// LOGIN

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
      rol: user.rol,
      name: user.name
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
});

module.exports = router;