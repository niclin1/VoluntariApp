import { verifyToken } from './jwt';

export function withAuth(handler) {
  return async (req, res) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid authorization header' });
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      const decoded = verifyToken(token);

      if (!decoded) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      // Add user data to request
      req.user = decoded;

      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };
}

export function withRole(...allowedRoles) {
  return (handler) => {
    return withAuth(async (req, res) => {
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden - insufficient permissions' });
      }
      return handler(req, res);
    });
  };
}
