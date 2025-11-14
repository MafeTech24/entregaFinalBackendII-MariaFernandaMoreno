const authorization = (roles = []) => {
  if (!Array.isArray(roles)) {
    roles = [roles];
  }

  roles = roles.map(r => r.toLowerCase());

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const userRole = (req.user.role || "").toLowerCase();

    if (!roles.includes(userRole)) {
      return res
        .status(403)
        .json({ error: "No tienes permisos para acceder a este recurso" });
    }

    next();
  };
};

module.exports = { authorization };
