const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const { userModel } = require("../dao/models/usersModels");
const { hashPassword, comparePasswords } = require("../utils/hash");
const { config } = require("./config");

const JWT_SECRET = config.JWT_SECRET || "claveultrasecreta";
const COOKIE_NAME = config.JWT_COOKIE_NAME || "jwtCoderToken";

/** Extractor de token desde cookie httpOnly */
const cookieExtractor = req => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[COOKIE_NAME];
  }
  return token;
};

/** Estrategia de REGISTRO */
passport.use("register", new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
    session: false
  },
  async (req, email, password, done) => {
    try {
      const { first_name, last_name, age } = req.body;

      const exists = await userModel.findOne({ email });
      if (exists) {
        return done(null, false, { message: "El email ya está registrado" });
      }

      const newUser = await userModel.create({
        first_name,
        last_name,
        email,
        age,
        password: hashPassword(password),
        role: "user"
      });

      return done(null, newUser);
    } catch (err) {
      return done(err);
    }
  }
));

/** Estrategia de LOGIN */
passport.use("login", new LocalStrategy(
  { usernameField: "email", passwordField: "password", session: false },
  async (email, password, done) => {
    try {
      const user = await userModel.findOne({ email });
      if (!user) return done(null, false, { message: "Usuario no encontrado" });

      const valid = comparePasswords(password, user.password);
      if (!valid) return done(null, false, { message: "Contraseña incorrecta" });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

/** Estrategia JWT (current) leyendo token desde cookie */
passport.use("jwt", new JwtStrategy(
  {
    jwtFromRequest: cookieExtractor,
    secretOrKey: JWT_SECRET
  },
  async (payload, done) => {
    try {
      const user = await userModel.findById(payload.sub).select("-password");
      if (!user) {
        return done(null, false, { message: "Token inválido o usuario no existe" });
      }
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
));

module.exports = passport;
