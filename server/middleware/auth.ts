import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'hackforge_jwt_production_secret_key';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'PARTICIPANT' | 'JUDGE' | 'ORGANIZER' | 'ADMIN';
  name: string;
  organization: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export function generateToken(user: AuthenticatedUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      organization: user.organization,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Authentication required. Bearer token missing.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Invalid or expired authentication session.' });
  }
}

export function requireRole(...allowedRoles: Array<'PARTICIPANT' | 'JUDGE' | 'ORGANIZER' | 'ADMIN'>) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `Forbidden: role '${req.user.role}' lacks permission for this endpoint. Required: [${allowedRoles.join(', ')}]`,
      });
      return;
    }

    next();
  };
}
