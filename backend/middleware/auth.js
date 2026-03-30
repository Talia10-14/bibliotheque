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
// function requireRole(role) {
//     return function (req, res, next) {
//       console.log('--- requireRole ---');
//     console.log('Rôles acceptés :', role);
//     console.log('Rôle utilisateur :', req.user?.role);
//       if (!req.user || req.user.role !== role) {
//         console.log('⛔ Accès refusé. Rôle non autorisé.');

//         return res.status(403).json({ message: `Accès réservé au rôle : ${role}` });
//       }
//       if (Array.isArray(role)) {
//         // Si roles est un tableau, vérifie que le rôle de l'utilisateur est dans ce tableau
//         if (!role.includes(req.user.role)) {
//           return res.status(403).json({ message: `Accès réservé aux rôles : ${roles.join(', ')}` });
//         }
//       } else {
//         // Sinon, simple comparaison avec un rôle string
//         if (req.user.role !== role) {
//           return res.status(403).json({ message: `Accès réservé au rôle : ${roles}` });
//         }
//       }
//       console.log('✅ Accès autorisé');

//       next();
//     };
 // }
 function requireRole(roles) {
  return function (req, res, next) {
    console.log('--- requireRole ---');
    console.log('Rôles acceptés :', roles);
    console.log('Rôle utilisateur brut :', `"${req.user?.role}"`);
    console.log('Rôle utilisateur trim:', `"${req.user?.role.trim()}"`);
    
    const userRole = req.user.role.trim().toLowerCase();

    if (!roles.includes(userRole)) {
      console.log('⛔ Accès refusé. Rôle non autorisé.');
      return res.status(403).json({ message: 'Accès refusé. Rôle insuffisant.' });
    }

    console.log('✅ Accès autorisé');
    next();
  };
}


module.exports = { verifyToken, requireRole };
