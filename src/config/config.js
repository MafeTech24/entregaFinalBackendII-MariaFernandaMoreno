const config = {
  PORT: process.env.PORT || 8080,

  // MongoDB
  USUARIO: process.env.USUARIO || "testform",
  PASSWORD: process.env.PASSWORD || "codercoder",
  MONGO_URL: process.env.MONGO_URL || "mongodb+srv://testform:codercoder@cluster0.8aqow9p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  DB_NAME: process.env.DB_NAME || "productosDB",

  // JWT para login
  JWT_SECRET: process.env.JWT_SECRET || "claveultrasecreta",
  JWT_COOKIE_NAME: process.env.JWT_COOKIE_NAME || "jwtCoderToken",

  // JWT para recuperar contraseña (expira 1h)
  JWT_RESET_SECRET: process.env.JWT_RESET_SECRET || "clave_reset_super_secreta",

  // Configuración de email
  MAIL_SERVICE: process.env.MAIL_SERVICE || "gmail",
  MAIL_USER: process.env.MAIL_USER || "tu_correo@gmail.com",
  MAIL_PASSWORD: process.env.MAIL_PASSWORD || "tu_app_password",

  // URL base para generar el link del mail
  BASE_URL: process.env.BASE_URL || "http://localhost:8080",
};

module.exports = { config };

