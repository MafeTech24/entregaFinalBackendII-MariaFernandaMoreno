const nodemailer = require("nodemailer");
const { config } = require("../config/config");

const transporter = nodemailer.createTransport({
  service: config.MAIL_SERVICE || "gmail",
  auth: {
    user: config.MAIL_USER,
    pass: config.MAIL_PASSWORD,
  },
  // Para evitar error de certificado
  tls: {
    rejectUnauthorized: false,
  },
});

const sendPasswordResetEmail = async (toEmail, resetToken) => {
  const resetLink = `${config.BASE_URL}/api/sessions/reset-password?token=${resetToken}`;

  
  console.log("🔗 LINK DE RESET:", resetLink);

  const html = `
    <h2>Restablecer contraseña</h2>
    <p>Has solicitado restablecer tu contraseña.</p>
    <p>Hacé clic en el siguiente botón (o enlace) para continuar. El enlace es válido por 1 hora.</p>
    <p>
      <a href="${resetLink}" 
         style="padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:4px;">
         Restablecer contraseña
      </a>
    </p>
    <p>Si no solicitaste este cambio, ignorá este correo.</p>
  `;

  try {
    await transporter.sendMail({
      from: `"Soporte" <${config.MAIL_USER}>`,
      to: toEmail,
      subject: "Restablecer contraseña",
      html,
    });
    console.log("Email de recuperación enviado");
  } catch (error) {
   
    console.error("⚠️ Error enviando mail de recuperación:", error.message);
  }
};

module.exports = {
  transporter,
  sendPasswordResetEmail,
};
