const express = require("express");
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");
const { config } = require("../config/config");

const router = express.Router();
const JWT_SECRET = config.JWT_SECRET || "claveultrasecreta";
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
        role: req.user.role
      }
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
        maxAge: 60 * 60 * 1000
      })
      .json({ message: "Login exitoso" }); 
  })(req, res, next);
});

// CURRENT 
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user });
  }
);

// OPCIONAL
router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME).json({ message: "Sesión cerrada" });
});

module.exports = router;
