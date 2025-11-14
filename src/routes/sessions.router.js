const express = require("express");
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");
const { config } = require("../config/config");
const { userModel } = require("../dao/models/usersModels");
const { hashPassword, comparePasswords } = require("../utils/hash");
const { sendPasswordResetEmail } = require("../mail/mailer");
const { UserDTO } = require("../dtos/user.dto");

const router = express.Router();

const JWT_SECRET = config.JWT_SECRET || "claveultrasecreta";
const JWT_RESET_SECRET = config.JWT_RESET_SECRET || JWT_SECRET;
const COOKIE_NAME = config.JWT_COOKIE_NAME || "jwtCoderToken";


// REGISTER
router.post(
  "/register",
  passport.authenticate("register", { session: false }),
  (req, res) => {
    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: req.user._id,
        email: req.user.email,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        role: req.user.role,
      },
    });
  }
);


// LOGIN
router.post("/login", (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res
        .status(401)
        .json({ message: info?.message || "Credenciales inválidas" });
    }

    const payload = { sub: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res
      .cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: false, 
        maxAge: 60 * 60 * 1000,
      })
      .json({ message: "Login exitoso" });
  })(req, res, next);
});


// CURRENT 
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const safeUser = new UserDTO(req.user);
    res.json({ user: safeUser });
  }
);


// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME).json({ message: "Sesión cerrada" });
});


// ---- Recuperación de contraseña -----

// 1º) Solicitar recuperación de contraseña
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email es requerido" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        status: "success",
        message:
          "Si el correo existe en el sistema, se ha enviado un enlace de recuperación.",
      });
    }

    const token = jwt.sign({ email: user.email }, JWT_RESET_SECRET, {
      expiresIn: "1h", // expira en 1 hora
    });

    await sendPasswordResetEmail(user.email, token);

    return res.json({
      status: "success",
      message:
        "Si el correo existe en el sistema, se ha enviado un enlace de recuperación.",
    });
  } catch (error) {
    console.error("Error en forgot-password:", error);
    return res
      .status(500)
      .json({ error: "Error al procesar la solicitud de recuperación" });
  }
});


// 2º) Mostrar formulario de nueva contraseña
router.get("/reset-password", (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send("Token faltante");
  }

  res.render("resetPassword", { token });
});


// 3º) Procesar nueva contraseña
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res
        .status(400)
        .json({ error: "Token y nueva contraseña son requeridos" });
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_RESET_SECRET);
    } catch (err) {
      return res
        .status(400)
        .json({ error: "Token inválido o expirado, solicitá uno nuevo." });
    }

    const user = await userModel.findOne({ email: payload.email });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Para evitar que repita la misma contraseña
    const samePassword = comparePasswords(password, user.password);
    if (samePassword) {
      return res.status(400).json({
        error:
          "La nueva contraseña no puede ser igual a la actual. Elegí una diferente.",
      });
    }

    const newHashedPassword = hashPassword(password);
    user.password = newHashedPassword;
    await user.save();

    return res.json({
      status: "success",
      message: "Contraseña actualizada correctamente. Ya podés iniciar sesión.",
    });
  } catch (error) {
    console.error("Error en reset-password:", error);
    return res
      .status(500)
      .json({ error: "Error al restablecer la contraseña" });
  }
});


module.exports = router;
