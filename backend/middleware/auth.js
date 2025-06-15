const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'uneclesecretepourlejwt';

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) return res.status(401).json({ message: 'Token manquant' });
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Format du token invalide' });
  }

  const token = parts[1];

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalide' });

    req.user = user; // injecte user dans la requête
    next();
  });
}
function requireRole(role) {
    return function (req, res, next) {
      if (!req.user || req.user.role !== role) {
        return res.status(403).json({ message: `Accès réservé au rôle : ${role}` });
      }
      next();
    };
  }

module.exports = { verifyToken, requireRole };
