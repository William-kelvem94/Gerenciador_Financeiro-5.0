import jwt from 'jsonwebtoken';

// Middleware para autenticação JWT
export function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Token não fornecido');
  jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send('Token inválido');
    req.user = decoded;
    next();
  });
}

// Middleware para autorizar por role
export function authorize(requiredRole) {
  return (req, res, next) => {
    if (req.user && req.user.role === requiredRole) {
      next();
    } else {
      res.status(403).json({ error: 'Acesso negado. Permissões insuficientes.' });
    }
  };
}
